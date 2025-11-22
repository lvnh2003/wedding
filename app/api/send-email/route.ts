import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, attending, guests, message } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Tên là bắt buộc" },
        { status: 400 }
      );
    }

    const recipientEmail = process.env.RECIPIENT_EMAIL || "quocdientra1412@gmail.com";

    const attendingText: { [key: string]: string } = {
      yes: "Có, tôi sẽ đến",
      no: "Tiếc là không thể",
      maybe: "Chưa chắc chắn",
    };

    const { data, error } = await resend.emails.send({
      from: "Wedding Invitation <onboarding@resend.dev>",
      to: recipientEmail,
      subject: `Xác nhận tham dự đám cưới - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8b1a1a; border-bottom: 2px solid #8b1a1a; padding-bottom: 10px;">
            Xác nhận tham dự đám cưới
          </h2>
          <div style="margin-top: 20px; line-height: 1.8;">
            <p><strong>Họ và tên:</strong> ${name}</p>
            <p><strong>Tham dự:</strong> ${attendingText[attending] || attending}</p>
            <p><strong>Số lượng khách:</strong> ${guests} ${guests === "1" ? "khách" : "khách"}</p>
            ${message ? `<p><strong>Lời nhắn:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>` : ""}
          </div>
          <p style="margin-top: 30px; color: #666; font-size: 14px; border-top: 1px solid #eee; padding-top: 20px;">
            Đây là email tự động từ trang web đám cưới.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Không thể gửi email" + error.message.toString() },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi" },
      { status: 500 }
    );
  }
}

