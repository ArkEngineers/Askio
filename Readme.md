
# **ASKIo**

ASKIo is an advanced AI-driven learning platform that transforms traditional document-based learning into an interactive and engaging experience. ASKIo enables users to upload content, ask questions, visualize answers, summarize notes, and more—all in a centralized, user-friendly platform. By leveraging Retrieval-Augmented Generation (RAG), ASKIo makes it easy to turn static information into a conversational and visualized learning experience.

## Demo-Video

https://github.com/user-attachments/assets/8779ca8c-82ba-457e-8777-bb4f749a4eed


## **Table of Contents**
1. [Features](#features)
2. [App Flow](#app-flow)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

---

## **Features**
- **PDF Upload**: Quickly upload PDF documents, making content instantly accessible for learning.
- **AI-Powered Q&A**: Ask questions directly based on uploaded content, and receive AI-generated answers sourced from the document.
- **Visualization Tools**: Transform complex answers into visuals to improve understanding.
- **Notes and Summaries**: Extract important points or summarize content for efficient studying.
- **Quizzes & Gamified Learning**: Take quizzes, compete in leaderboards, and engage in spaced repetition to reinforce knowledge.
- **Collaborative Workspaces**: Invite others to a shared study space with role-based permissions and track progress.
- **Meta Tags and Custom Tagging**: Use auto-suggested and custom tags for quick search and organization.
- **Search and Retrieval**: Seamlessly search across datasets and tagged sections for precise information retrieval.

---

## **App Flow**
1. **Authentication**: Users start by logging in or creating an account.
2. **Group Selection**: Upon login, users can join or create a study group (e.g., classes or teams).
3. **Document Upload & Interaction**:
    - Users can upload PDFs, which the AI processes to enable question-based interaction.
    - Ask questions related to uploaded content and view AI-generated answers.
4. **Learning Tools**:
    - Access sections for **Visualizations**, **Notes & Summaries**, **Quizzes**, and **Study Helper**.
5. **Collaboration & Gamification**:
    - Invite others to join workspaces.
    - Access leaderboards and quiz results to foster a competitive learning environment.
6. **Custom Tagging and Meta Tags**:
    - Organize and filter documents by tags, or search across the entire dataset based on specific needs.
    
---

## **Technologies Used**

- **Frontend**: React Native for a smooth, cross-platform mobile experience.
- **Backend**: Django or Flask for API creation and user management.
- **AI**: Retrieval-Augmented Generation (RAG) for document parsing and question-answering.
- **Database**: MongoDB for flexible and efficient document storage and tagging.
- **Authentication**: OAuth2 for secure login and user management.
- **Gamification**: Leaderboards and spaced repetition algorithms for engaging learning.
- **File Processing**: PDF parsers and AI-powered visualization libraries to handle uploads and render visualized answers.
- **Deployment**: Docker for containerization and ease of deployment.

---

## **Getting Started**

### Prerequisites
- Node.js and npm
- MongoDB
- Python Flask installed

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/ASKIo.git
   cd ASKIo
   ```

2. Install dependencies for frontend and backend:
   ```bash
   npm install          # for frontend
   pip install -r requirements.txt  # for backend
   ```

3. Set up MongoDB and environment variables for API keys and database configurations.

4. Run the development server:
   ```bash
   npm start   # start frontend
   python manage.py runserver   # start backend
   ```

---

## **Usage**
1. **User Authentication**: Log in or register to create a study group or join an existing one.
2. **Upload and Ask**: Upload PDFs and start querying the AI for specific information.
3. **Visualize and Summarize**: Use visualization tools for complex answers and summary tools for key points.
4. **Engage and Compete**: Take quizzes, join the leaderboard, and repeat learning with spaced repetition.
5. **Collaborate**: Invite friends or teammates to work together in the shared workspace.

---

## **Contributing**
We welcome contributions to enhance ASKIo. To contribute:
1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-name`).
3. Commit changes and push to your branch.
4. Open a pull request with a description of your changes.

---

## **License**
Distributed under the MIT License. See `LICENSE` for more information.

---

**ASKIo: Empowering Learning Through AI-Driven Interactivity**
