# 🛒 Local Mart
**Local Mart** is an online marketplace platform designed to connect local vendors with customers.  
It increases the visibility of local businesses by registering vendors on the website and listing their products online.  
Customers can conveniently browse a variety of local goods and support community businesses.

---

## ✨ Key Features

- ✅ **Vendor Registration** – Local vendors can easily create an account and start selling  
- ✅ **Vendor Login** – Secure login system for vendors to manage their profile and products  
- ✅ **Product Management** – Vendors can add products by linking image URLs and product details  
- ✅ **Product Browsing** – Customers can browse a diverse catalog of local products  
- ✅ **Separate Vendor & Product Pages** – Distinct pages for viewing vendors and their specific products  
- ✅ **Responsive Design** – Smooth experience across mobile, tablet, and desktop devices  
- ✅ **Data Persistence** – All vendor and product data stored securely

---

## 🛠️ Technologies Used

### Backend:
- 🟢 **Node.js** – JavaScript runtime for building scalable server-side applications  
- 🚂 **Express.js** – Web framework for Node.js to build APIs and server-side logic  
- 🍃 **MongoDB** – NoSQL database for storing vendor and product information  

### Frontend:
- 🧩 **HTML** – Markup language for creating the structure of web pages  
- 🎨 **CSS** – Stylesheets for designing beautiful and responsive layouts  
- ✨ **JavaScript** – For interactive and dynamic behavior in web pages  

### Containerization:
- 🐳 **Docker** – Platform to containerize the application for consistent deployment

### CI/CD:
- 🤖 **Jenkins** – Automate building, testing, and deploying the application

---

## 📦 Installation

1️⃣ **Clone the repository:**

    git clone https://github.com/YourUsername/Local-Mart.git

2️⃣ **Navigate to the project directory:**

    cd Local-Mart

3️⃣ **Install server-side dependencies:**

    npm install

4️⃣ **Start the backend server:**

    npm start

> The server will typically run on `http://localhost:3000` unless otherwise configured.

---

## 🤖 Jenkins for CI/CD

You can automate your build and deployment process using **Jenkins**.

### 📦 Set Up Jenkins Pipeline

1️⃣ **Install Jenkins and required plugins**  
Ensure Jenkins is installed on your machine, and you have the necessary plugins (e.g., Git, NodeJS, Docker).

2️⃣ **Set up a Jenkinsfile**  
In the root of your project, create a `Jenkinsfile` to define the CI/CD pipeline. Example:
```groovy
    pipeline {
        agent any
        stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Clone Repository') {
            steps {
                bat "git clone %REPO_URL%"
            }
        }

        stage('Build Docker Images') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    dir("${PROJECT_NAME}") {
                        bat 'docker-compose build'
                    }
                }
            }
        }


        stage('Tag Docker Image') {
            steps {
                bat 'docker tag online-local-mart-backend %IMAGE_NAME%'
            }
        }

        stage('Login to DockerHub') {
            steps {
                bat "echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin"
            }
        }

        stage('Push to DockerHub') {
            steps {
                bat 'docker push %IMAGE_NAME%'
            }
        }

        stage('Start Containers') {
            steps {
                dir("${PROJECT_NAME}") {
                    bat 'docker-compose up -d'
                }
            }
        }

        stage('Verify Running Containers') {
            steps {
                bat 'docker ps -a'
            }
        }
    }
        }
    }
```

3️⃣ **Run the Jenkins pipeline**  
After configuring your Jenkins pipeline, trigger the build process either manually or automatically on code changes.

4️⃣ **Monitor the build progress**  
Visit the Jenkins dashboard to monitor the build, test, and deployment status.

- 📚 [Jenkins Documentation](https://www.jenkins.io/doc/)

---

## 🐳 Docker Support

You can also run this project using **Docker**.

### 📦 Build and Run with Docker Compose

1️⃣ **Make sure Docker and Docker Compose are installed**  
2️⃣ **In the project root, run:**

    docker-compose up --build

3️⃣ **Visit the app in your browser:**

    http://localhost:3000

---

## 🚀 How to Use

### 🛒 **Vendor Features:**
- **Register** as a vendor by providing necessary details
- **Login** to manage products and view profile
- **Add Products** with title, description, price, and image URL

### 👥 **Customer Features:**
- **Browse Products** listed by different vendors
- **View Vendor Profiles** to see more products from the same vendor

> 💡 Simple and intuitive UI designed for ease of use on all devices.

---

## 📸 Screenshots

### 🖥️ Home Page
![Home Page](https://github.com/user-attachments/assets/6a7cd53b-730c-4f24-86a5-2ff9c9a2d4f1)
![image](https://github.com/user-attachments/assets/8b6abdd6-274a-48e9-b5e0-6ae990065656)


The homepage displays a list of products from various local vendors.

### 🧾 Vendor Registration
![image](https://github.com/user-attachments/assets/d4d4abd4-ca22-4f90-87b8-1256ab5f8334)
Page for new vendors to register and get started with selling products.

### 🛍️ Product Listing Page
![image](https://github.com/user-attachments/assets/d6a2a0a4-714e-48c5-bc5f-80826228ea37)
A list of products with images, prices, and vendor details.

### 👤 Vendor Profile Page
![image](https://github.com/user-attachments/assets/728c1a35-950c-4698-b561-ed7695972fe3)
A dedicated page showing all products listed by a specific vendor.

### 🛍️ Product Page
![image](https://github.com/user-attachments/assets/9e1d3a93-90ca-4f9b-8434-554b9a9e6555)
A dedicated page showing product details.

---

## 📄 License

This project is licensed under the **MIT License**.
```
Permission is hereby granted, free of charge, to any person obtaining a copy  
of this software and associated documentation files (the "Software"), to deal  
in the Software without restriction, including without limitation the rights  
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell  
copies of the Software, and to permit persons to whom the Software is  
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all  
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR  
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,  
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE  
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER  
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,  
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE  
SOFTWARE.
```
For more details, please refer to the [LICENSE](LICENSE) file in this repository.

---

## 👨‍💻 Author

**Ruchi Jaiswal**  
GitHub: [@Ruchi](https://github.com/RJais0911)  

---

## 🙏 Acknowledgments

- 📚 [Node.js Documentation](https://nodejs.org/en/docs)  
- 🚂 [Express.js Docs](https://expressjs.com/)  
- 🍃 [MongoDB Docs](https://www.mongodb.com/docs/)  
- 🐳 [Docker Documentation](https://docs.docker.com/)  
- 🤖 [Jenkins Documentation](https://www.jenkins.io/doc/)  
- 💻 [MDN Web Docs - HTML/CSS/JS](https://developer.mozilla.org/en-US/)

Made with ❤️ by Ruchi Jaiswal


---

## 🔧 Added: Ansible + Nagios integration (non-breaking)

### Manual run (Docker)
- App only:
  - Backend: `docker compose up -d backend` then visit `http://localhost:3000`
  - Frontend: `docker compose up -d frontend` then visit `http://localhost:80`
- With optional MongoDB (profile):
  - `docker compose --profile db up -d`
  - Set `MONGO_URI` in `.env` (see example in Ansible README) or rely on your Atlas defaults in `src/db.js`.
- With Nagios monitoring:
  - `docker compose up -d nagios`
  - Open Nagios UI: `http://localhost:8080` (user: `nagiosadmin`, pass: `nagiosadmin` by default)
  - Monitors backend HTTP, container uptime, and CPU/memory.

### Ansible deploy (optional)
- See `ansible/README.md` for full usage.
- Quick start (local deploy):
  - `cd ansible`
  - `ansible-galaxy collection install -r requirements.yml`
  - `ansible-playbook -i "localhost," -c local site.yml`  (add `-e with_db=true` to enable MongoDB)
