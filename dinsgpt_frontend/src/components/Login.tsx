import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Login({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    try {
      const route = isLogin ? "login" : "register"
      const res = await axios.post(`http://localhost:8000/auth/${route}`, {
        username: email,
        password,
      })

      const token = res.data.access_token
      localStorage.setItem("token", token)
      setError("")
      onAuth()
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isLogin ? "Login to DinsGPT" : "Register on DinsGPT"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <Input placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleSubmit}>{isLogin ? "Login" : "Register"}</Button>
            <div className="text-center text-sm">
              {isLogin ? "New user?" : "Already have an account?"}{" "}
              <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="p-0">
                {isLogin ? "Register here" : "Login"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
