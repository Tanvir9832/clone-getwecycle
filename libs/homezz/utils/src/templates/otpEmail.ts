import { theme } from "../theme";

export const otpEmail = (code: string) => {
  return `
        <html>
            <head>
                <style>
                    * {
                        text-align: center;
                        font-family: "inter"
                    }
                    
                    body {
                        background-color: #efefef
                    }
                    
                    .container {
                        display: grid;
                        background-color: white;
                        max-width: 800px;
                        margin: 40px auto;
                        padding-bottom: 40px;
                        border-radius: 10px;      
                        border: 0.5px solid black;
                    }
                    
                    .message {
                        background-color: ${theme.primary};
                        color: white;
                        padding: 10px;
                    }

                    .text-green {
                        color: ${theme.primary};
                    }
                    
                    .logo {
                        font-size: 30px;
                        font-weight: 800;
                        margin-bottom: 0px;
                    }
                    
                    .username {
                        color: ${theme.primary};
                        font-weight: 800;
                        }
                        
                    .subtitle {
                        font-weight: 800;
                        color: grey;
                    }
                    
                    .action {
                        margin-top: 60px;
                    }
                    
                    .action span {
                    	background-color: ${theme.primary};
                        padding: 10px 20px;
                        color: white !important;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        font-size: 30px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                <p class="logo">We<span class="text-green">Cycle</span></p>
                <p class="subtitle">WeCycle OTP Verification</p>
                <div class="message">
                    <p>
                        Copy this code and paste it in the app to verify your email.
                    </p>
                </div>
                <div class="action">
                    <span>
                        ${code}
                    </span>
                </div>
                </div>
            </body>
        </html>
        `;
};
