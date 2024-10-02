import { theme } from "../theme";

export type Email = {
    name?: string;
    email?: string;
    message: string;
};

export const contactEmail = ({ name, email, message }: Email) => {
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
                    
                    .logo {
                        color: ${theme.primary};
                        font-size: 30px;
                        font-weight: 800;
                        margin-bottom: 0px;
                    }
                    
                    .username {
                        color: ${theme.primary};
                        font-weight: 800;
                    }
                    
                    .subtitle {
                        color: grey
                    }
                    
                    .action{
                        margin-top: 40px;
                    }
                    
                    a {
                        text-decoration: none;
                        background-color: ${theme.primary};
                        color: white !important;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                <p class="logo">Homezz</p>
                <p class="subtitle"><span class="username">${name} have sent you message from Homezz</span></p>
                <div class="message">
                    <p>${message}</p>
                </div>
                <div class="action">
                    <a href="mailto:${email}?Subject=Tanbel - Thanks for Chatting in" target="_top">Reply</a>
                </div>
                </div>
            </body>
        </html>
        `;
};