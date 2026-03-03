declare const _default: () => {
    port: string | undefined;
    db: {
        url: string | undefined;
    };
    EMAIL_USER: string | undefined;
    EMAIL_PASS: string | undefined;
    OTP_Body: {
        body: (otp: string) => string;
    };
    JWT_SECRET: string | undefined;
};
export default _default;
