export function generateOTP(){
    return Math.floor(100000 + Math.random() * 900000);
};

export function OTPHTML(otp){
    return `
        <div style="font-family: Arial, sans-serif; text-align: center;">
            <h2 style="color: #333;">Your OTP Code</h2>
            <p style="font-size: 18px; color: #555;">Please use the following OTP to complete your action:</p>
            <div style="font-size: 24px; font-weight: bold; color: #007BFF; margin: 20px 0;">${otp}</div>
            <p style="font-size: 14px; color: #999;">This OTP will expire in 10 minutes.</p>
        </div>
    `;
}