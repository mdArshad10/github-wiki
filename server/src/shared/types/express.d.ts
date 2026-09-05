import type { auth } from "../auth";

declare global {
    namespace Express {
        interface Request {
            session: typeof auth.$Infer.Session.session;
            user: typeof auth.$Infer.Session.user;
        }
    }
}

export {};