import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SellerMsg from "@/models/SellerMsg";
import nodemailer from "nodemailer";
import { Types } from "mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing id or reason" },
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    // Find message to get seller email
    const message = await SellerMsg.findById(id);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const sellerEmail = message.email.toLowerCase();
    const sellerName = message.sellerName;
    if (!sellerEmail) {
      return NextResponse.json(
        { error: "No email field found in message" },
        { status: 400 }
      );
    }
    const seller = await User.findOne({ email: sellerEmail });

    let sellerId;
    if (seller) {
      // Already exists → just send password setup link
      sellerId = seller._id;
    } else {
      // 🔹 4. Create new seller

      const result = await User.create({
        email: sellerEmail,
        username: sellerName,
        password: "",
        role: "seller",
        verified: false,
        createdAt: new Date(),
      });
      sellerId = result._id;
    }
    // 🔹 5. Setup mail transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔹 6. Generate password setup link
    const setPasswordUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/seller/set-password?id=${sellerId}`;

    // ✅ Compose mail
    const mailOptions = {
      from: `"E-Commerce Support" <${process.env.EMAIL_USER}>`,
      to: sellerEmail,
      subject: "Set Your Seller Account Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f8f9fb; border-radius: 10px;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 24px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #333;">Set Your Password</h2>
            <p style="font-size: 15px; color: #555; text-align: center;">
          Hello, ${sellerName}. Your seller account request has been approved. Please click below to set your password:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${setPasswordUrl}" 
                 style="display: inline-block; background-color: #5e3e89; color: white; 
                        text-decoration: none; padding: 12px 28px; border-radius: 6px; 
                        font-weight: 600; font-size: 15px;">
                Set Password
              </a>
            </div>

            <p style="font-size: 13px; color: #777; text-align: center;">
              If you didn’t request this, please ignore this email. The link will expire soon.
            </p>

            <hr style="margin-top: 24px; border: none; border-top: 1px solid #eee;">
            <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 12px;">
              &copy; ${new Date().getFullYear()} E-Commerce. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    // ✅ Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Accept seller request and sent email successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Accept Seller Error:", error);
    return NextResponse.json(
      { error: "Something went wrong while sending accept email." },
      { status: 500 }
    );
  }
}
