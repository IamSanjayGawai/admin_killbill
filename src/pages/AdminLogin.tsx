// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";

// const AdminLogin: React.FC = () => {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   const navigate = useNavigate();
  
//   const handleSubmit = async (e?: React.FormEvent) => {
//     e?.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       const res = await axios.post("http://localhost:4000/api/admin/login", {
//         email,
//         password
//       });

//       // Example: expecting res.data.token from backend
//      const token = localStorage.setItem("adminToken", res.data.token);

//       // Redirect to dashboard
//       navigate("/");

//     } catch (err: any) {
//       setError(err.response?.data?.message || "Invalid credentials");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//     console.log("Admin login attempt", { email, password });
//     setIsLoading(false);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleSubmit(e);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4"
//       style={{
//         background:
//           "linear-gradient(135deg, #540863 0%, #92487A 50%, #E49BA6 100%)",
//       }}
//     >
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//           <div className="p-8 text-center" style={{ backgroundColor: "#540863" }}>
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4">
//               <Shield className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
//             <p className="text-white text-opacity-90">Log in to your account</p>
//           </div>

//           <div className="p-8">
//             <div className="space-y-6">
//               {/* Email */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium mb-2"
//                   style={{ color: "#540863" }}
//                 >
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail className="h-5 w-5" style={{ color: "#92487A" }} />
//                   </div>

//                   <input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     onKeyDown={handleKeyPress}
//                     className="block w-full pl-10 pr-3 py-3 border-2 rounded-lg 
//                     focus:outline-none focus:ring-2 focus:ring-[#92487A]"
//                     style={{ borderColor: "#E49BA6" }}
//                     placeholder="admin@example.com"
//                   />
//                 </div>
//               </div>

//               {/* Password */}
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium mb-2"
//                   style={{ color: "#540863" }}
//                 >
//                   Password
//                 </label>

//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5" style={{ color: "#92487A" }} />
//                   </div>

//                   <input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     onKeyDown={handleKeyPress}
//                     className="block w-full pl-10 pr-12 py-3 border-2 rounded-lg 
//                     focus:outline-none focus:ring-2 focus:ring-[#92487A]"
//                     style={{ borderColor: "#E49BA6" }}
//                     placeholder="••••••••"
//                   />

//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5" style={{ color: "#92487A" }} />
//                     ) : (
//                       <Eye className="h-5 w-5" style={{ color: "#92487A" }} />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Error */}
//               {error && (
//                 <div className="p-3 rounded-lg text-sm text-red-800 bg-red-100 border border-red-200">
//                   {error}
//                 </div>
//               )}

//               {/* Remember + Forgot */}
//               <div className="flex items-center justify-between text-sm">
//                 <label className="flex items-center cursor-pointer">
                 
                 
//                 </label>
                
//               </div>

//               {/* Button */}
//               <button
//                 onClick={handleSubmit}
//                 disabled={isLoading}
//                 className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all 
//                   duration-300 transform hover:scale-105 hover:shadow-lg 
//                   disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #540863 0%, #92487A 100%)",
//                 }}
//               >
//                 {isLoading ? (
//                   <span className="flex items-center justify-center">
//                     <svg
//                       className="animate-spin h-5 w-5 mr-3"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                         fill="none"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                     Logging ...
//                   </span>
//                 ) : (
//                   "Sign In"
//                 )}
//               </button>
//             </div>

         
//           </div>
//         </div>

//         <div className="mt-4 text-center text-white text-sm opacity-90">
//           <p>🔒 Secured with end-to-end encryption</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;




import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/admin/login", {
        email,
        password,
      });
  
      // Save token safely, as res.data is unknown
      const token = (res && typeof res.data === "object" && res.data !== null && "token" in res.data)
        ? (res.data as { token: string }).token
        : null;
      if (token) {
        localStorage.setItem("adminToken", token);
        // Redirect to dashboard
        navigate("/");
      } else {
        throw new Error("Invalid login response; no token received");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #540863 0%, #92487A 50%, #E49BA6 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center" style={{ backgroundColor: "#540863" }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-white text-opacity-90">Log in to your account</p>
          </div>

          <div className="p-8">
            <div className="space-y-6">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#540863" }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5" style={{ color: "#92487A" }} />
                  </div>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="block w-full pl-10 pr-3 py-3 border-2 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#92487A]"
                    style={{ borderColor: "#E49BA6" }}
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#540863" }}
                >
                  Password
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5" style={{ color: "#92487A" }} />
                  </div>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="block w-full pl-10 pr-12 py-3 border-2 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#92487A]"
                    style={{ borderColor: "#E49BA6" }}
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" style={{ color: "#92487A" }} />
                    ) : (
                      <Eye className="h-5 w-5" style={{ color: "#92487A" }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg text-sm text-red-800 bg-red-100 border border-red-200">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all 
                  duration-300 transform hover:scale-105 hover:shadow-lg 
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{
                  background:
                    "linear-gradient(135deg, #540863 0%, #92487A 100%)",
                }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging ...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-white text-sm opacity-90">
          <p>🔒 Secured with end-to-end encryption</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
