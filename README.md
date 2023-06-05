# DeadlineCalculatorApp

The Deadline Calculator is a tool designed to assist you in managing your tasks more efficiently. It calculates the required daily work hours based on your input - the task name, total hours needed, start date, and deadline. This helps you understand your workload and effectively distribute your efforts over time.

To get started with the Deadline Calculator application, you'll need to run the backend and frontend separately.

You can run the backend (server) by executing the JAR file located in the target directory. Open your terminal/command prompt, navigate to the target directory, and run the JAR file using the Java command:
java -jar deadline-0.0.1-SNAPSHOT.jar

To start the frontend, follow these steps:
    1. Open the project folder in Visual Studio Code.
    2. Right-click on the index.html file located in DeadlineFront directory and choose "Open with Live Server". This will start a local development server and automatically open the application in your default web browser.
    Alternatively, you can open your browser and type the URL: http://127.0.0.1:3000/DeadlineFront/deadline.html


Please note: The frontend must be able to communicate with the backend for the application to work properly. Ensure that the backend server is running while you're using the application.
   1. Enter your task name, total hours required, start date, and deadline.
   2. Click on the "Get schedule" button.
   3. The application will prompt you to enter amount of hours each day, that you are busy.
   4. Click on the "Get Plan" button.
   5.The application a detailed breakdown of the hours required each day to meet your deadline.  


