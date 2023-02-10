# instagram_clone

## Instagram clone project for PWD Bootcamp Selection Test

- Framework: ReactJS
- Library:

  - Frontend: tailwindcss, chakraui, react router dom, react hot toast, react icon, formik, yup, axios,
  - Backend: express, mysql2, cors, jsonwebtoken, bcrypt, nodemailer, multer, dotenv, handlebars

- Installation:

  - Frontend: <pre><code>npm i @chakra-ui/icons @chakra-ui/react @emotion/react @emotion/styled axios react-router-dom@6 formik yup react-hot-toast react-icons</code></pre>
  - tailwindcss: <pre><code>npm install -D tailwindcss</code></pre>
  <pre><code>npx tailwindcss init</code></pre>

  - Backend: <pre><code>npm i express body-parser mysql2 cors jsonwebtoken bcrypt multer nodemailer dotenv handlebars</code></pre>
  - ORM: <pre><code>npm install --save-dev sequelize sequelize-cli</code></pre>
    <pre><code>npx sequelize-cli init</code></pre>

- Pages:

  - register
  - login
  - verification
  - forgetPassword
  - profile
  - home
  - postDetails

- Components:

  - sidebar
  - card

- Database:
  - users: id, username, password, email, profile_picture, fullname, bio, is_verified, created_at
  <pre><code>npx sequelize-cli model:generate --name users --attributes username:string,password:string,email:string,profile_picture:string,fullname:string,bio:string,is_verified:boolean</code></pre>
  - contents: id, media, caption, like, created_at, users_id
  <pre><code>npx sequelize-cli model:generate --name contents --attributes media:string,caption:string,like:integer</code></pre>
  - comments: id, comment_body, created_at, contents_id
  <pre><code>npx sequelize-cli model:generate --name comments --attributes comment_body:string</code></pre>
