import { create } from "zustand"
import { persist } from "zustand/middleware"

interface IUser{
  email:string | null,
  avatarUrl:string | null,
  githubUsername:string | null,  
}

type UiUser = {
  session: string,
  userDetail:IUser
  setSession: (session: string) => void,
  setUserDetails:(user:IUser) => void
}


export const useUserStore = create<UiUser>()(
  persist(
    (set) => ({
      session: "",
      userDetail:{
        email: null,
        avatarUrl: null,
        githubUsername:null,
      },
      setSession: (session: string) => set({session}),
      setUserDetails:(user:any)=> {
        const userDetail = {
            email: user.email,
        avatarUrl: user.avatarUrl,
        githubUsername: user.githubUsername}  
        set({userDetail})
      },
    }),
    {
      name: "github-wiki-user-session",
      partialize: (state) => ({
        session: state.session,
        userDetail: state.userDetail
      }),
    }
  )
)
