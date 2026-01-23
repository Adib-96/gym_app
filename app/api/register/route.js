// app/api/register/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    // Parse traditional form data
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm-password");
    const role = formData.get("role");

    // Basic validation
    if (!email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simulate saving to database
    console.log("Email:", email);
    console.log("Hashed Password:", hashedPassword);
    console.log("Role:", role);

    return NextResponse.json({ message: "User registered successfully!" ,status : 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
