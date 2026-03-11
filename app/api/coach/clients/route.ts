import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import supabase from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Only coaches can access this
  if (user.role !== 'coach') {
    return NextResponse.json(
      { error: 'Only coaches can access client list' },
      { status: 403 }
    );
  }

  try {
    // Get all clients (unassigned or assigned to coach)
    const { data: clients, error: supabaseError } = await supabase
      .from('clients')
      .select(`
        id,
        user_id,
        coach_id,
        date_of_birth,
        gender,
        height,
        weight,
        fitness_level,
        goals,
        status,
        created_at
      `)
      .or(`coach_id.is.null,coach_id.eq.${user.userId}`)
      .order('created_at', { ascending: false });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw supabaseError;
    }

    // Also fetch all users with role='user' who might not have client records yet
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('role', 'user')
      .order('name');

    if (usersError) {
      console.error('Users error:', usersError);
      throw usersError;
    }

    // Create a set of user_ids that already have client records
    const existingClientUserIds = new Set((clients || []).map(c => c.user_id));

    // Get user data for existing clients
    const userIds = (clients || []).map(c => c.user_id);
    let userMap = new Map();
    
    if (userIds.length > 0) {
      const { data: users, error: userDetailError } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', userIds);

      if (userDetailError) {
        console.error('User detail error:', userDetailError);
        throw userDetailError;
      }

      userMap = new Map(users?.map(u => [u.id, u]) || []);
    }

    // Format existing clients
    const formattedClients = (clients || []).map(client => {
      const userData = userMap.get(client.user_id);
      return {
        id: client.id,
        user_id: client.user_id,
        name: userData?.name || 'Unknown',
        email: userData?.email || 'Unknown',
        date_of_birth: client.date_of_birth,
        gender: client.gender,
        height: client.height,
        weight: client.weight,
        fitness_level: client.fitness_level,
        goals: client.goals,
        status: client.status,
        created_at: client.created_at,
        coaching_status: client.coach_id ? 'assigned' : 'unassigned'
      };
    });

    // Add users who don't have client records yet as potential clients
    const potentialClients = (allUsers || [])
      .filter(user => !existingClientUserIds.has(user.id))
      .map(user => ({
        id: `temp-${user.id}`, // Temporary ID for new clients
        user_id: user.id,
        name: user.name,
        email: user.email,
        date_of_birth: null,
        gender: null,
        height: null,
        weight: null,
        fitness_level: null,
        goals: null,
        status: null,
        created_at: null,
        coaching_status: 'potential'
      }));

    // Combine and return
    const allClients = [...formattedClients, ...potentialClients];

    return NextResponse.json({
      success: true,
      clients: allClients
    });

  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (user.role !== 'coach') {
    return NextResponse.json(
      { error: 'Only coaches can add clients' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { clientId, email } = body;

    // Case 1: Assign existing client by ID
    if (clientId) {
      // Check if this is a temporary ID for a new client (format: temp-{user_id})
      if (clientId.startsWith('temp-')) {
        const userId = clientId.replace('temp-', '');
        
        // Create and assign new client record
        const { data: newClient, error: insertError } = await supabase
          .from('clients')
          .insert([{
            user_id: userId,
            coach_id: user.userId,
            status: 'Active'
          }])
          .select('id')
          .single();

        if (insertError) {
          throw insertError;
        }

        return NextResponse.json({
          success: true,
          clientId: newClient.id,
          message: 'Client created and assigned successfully'
        });
      }

      // Existing client ID - just assign to coach
      const { data: existingClient, error: checkError } = await supabase
        .from('clients')
        .select('id, coach_id')
        .eq('id', clientId)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (!existingClient) {
        return NextResponse.json(
          { error: 'Client not found' },
          { status: 404 }
        );
      }

      // Check if already assigned to another coach
      if (existingClient.coach_id && existingClient.coach_id !== user.userId) {
        return NextResponse.json(
          { error: 'Client is already assigned to another coach' },
          { status: 400 }
        );
      }

      // Assign client to coach
      const { error: updateError } = await supabase
        .from('clients')
        .update({ coach_id: user.userId })
        .eq('id', clientId);

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json({
        success: true,
        clientId: clientId,
        message: 'Client assigned successfully'
      });
    }

    // Case 2: Invite client by email (for future use)
    if (email) {
      // Check if user exists
      const { data: clientUser, error: userError } = await supabase
        .from('users')
        .select('id, role')
        .eq('email', email)
        .maybeSingle();

      if (userError) {
        throw userError;
      }

      if (!clientUser) {
        return NextResponse.json(
          { error: 'User with this email does not exist' },
          { status: 404 }
        );
      }

      // Check if user is already a client or coach
      if (clientUser.role === 'coach') {
        return NextResponse.json(
          { error: 'Cannot add a coach as a client' },
          { status: 400 }
        );
      }

      // Check if already assigned to a coach
      const { data: existingClientByUser, error: checkError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', clientUser.id)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingClientByUser) {
        return NextResponse.json(
          { error: 'User is already a client' },
          { status: 400 }
        );
      }

      // Create client record
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert([{
          user_id: clientUser.id,
          coach_id: user.userId,
          status: 'Active'
        }])
        .select('id')
        .single();

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json({
        success: true,
        clientId: newClient.id,
        message: 'Client invited and assigned successfully'
      });
    }

    return NextResponse.json(
      { error: 'Either clientId or email is required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error adding client:', error);
    return NextResponse.json(
      { error: 'Failed to add client' },
      { status: 500 }
    );
  }
}