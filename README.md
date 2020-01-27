# Chores&Money App

To run App in development modeRun `npm install` in root folder
Change directory tp /frontend and run `npm install` there
If you don't have installed Angular CLI, install it via `npm install -g @angular/cli`

Change directory to root folder and create a folder /config, save there config files which you can ask me about or create them by your own)
You must have running mongod and  mongo db.
In root directory run `npm start` for a dev server. Navigate to `http://localhost:4200/`.

How to test:
1. Click on button Register parent, fill a form and register an account for parent. Use real email, because you should receive email about registration.
2. Log in
3. Click on menu button, menu must open
4. Click on Add a child
5. Click on Register a child, fill a form, click Register.
6. Open menu, click on Add a chore, fill a form, click on Create a new chore. Short message is shown.
7. Click on logo in header (Chores&Money). Start page with shortcuts is opened. Shortcuts shows info about chores with different states: In progress - chores which are assigned but not done yet, Ready to pay - chores are done, but not paid, To confirm - chores are created by your child, waiting for your review, Messages- unread messages about chores' state changing. Feel free to click on every shortcut
8. Click on menu, click on Chores. Chores list is opened. There is one chore at least, that you created on step 6. Click on V to mark it as Done. Parent as well as Child can mark a chore as Done.
9. Stay on Chores page. Choose To pay tab, our chore is already there and is waiting to be paid. Click on V and mark it as Paid. Only Parent has access to this action. When chore is paid it is automatically archived. Check it by clicking on tab Archive
10. Create one more chore. but set flag in Donation input. It means that you are the best parent and give money to your child without any chore to do. Created donation marked as Done directly and sorted to To pay tab.
11. Open menu and navigate to Balance page. As a parent you can see how many money have you paid already, how many money you are waiting to be paid out (done, but not paid chores).
12. Stay on balance page, click on Outgoing transactions - you can see a list of paid chores with a payment date.
13. Open menu, click on Children. Children list is shown. Click on plane-icon to create a chore for this child.
14. Open menu, click on log out. You will be logged out.
15. Log in as a child (from step 5)
16. Repeat steps 6-14.
17. Open menu, click on Add transaction, fill form and click on Create transaction. This feature is added to give an opportunity to keep balance up-to-date. Only decrement transactions available. Only child has access to create transactions.
18. Open Balance page and check incoming transactions (from parent) and outgoing transactions (created by child)
19.Open menu, click on profile - you can change your profile info, but you can't duplicate email address or phone number.
20.Create donation transaction by a child, log in as a Parent (it is possible to do simultaneously in alternative browser (ex. Chrome and Opera or Firefox).
21.As a parent click on shortcut TO confirm. You can reject pending chore and delete it directly.


Happy testing!
P.S. it is beta version and bugs can meet=)


