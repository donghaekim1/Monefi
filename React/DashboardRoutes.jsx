import {v4 as uuid} from "uuid";
/**
 *  All Dashboard Routes
 *
 *  Understanding name/value pairs for Dashboard routes
 *
 *  Applicable for main/root/level 1 routes
 *  icon 		: String - It's only for main menu or you can consider 1st level menu item to specify icon name.
 * 				: Object - Icon as an object added from v1.4.0.
 *
 *  Applicable for main/root/level 1 and subitems routes
 * 	id 			: Number - You can use uuid() as value to generate unique ID using uuid library, you can also assign constant unique ID for react dynamic objects.
 *  title 		: String - If menu contains childern use title to provide main menu name.
 *  badge 		: String - (Optional - Default - '') If you specify badge value it will be displayed beside the menu title or menu item.
 * 	badgecolor 	: String - (Optional - Default - 'primary' ) - Used to specify badge background color.
 *
 *  Applicable for subitems / children items routes
 *  name 		: String - If it's menu item in which you are specifiying link, use name ( don't use title for that )
 *  children	: Array - Use to specify submenu items
 *
 *  Used to segrigate menu groups
 *  grouptitle : Boolean - (Optional - Default - false ) If you want to group menu items you can use grouptitle = true,
 *  ( Use title : value to specify group title  e.g. COMPONENTS , DOCUMENTATION that we did here. )
 *
 */

export const DashboardMenu = [
  {
    id: uuid(),
    title: "Dashboard",
    icon: "home",
    roles: ["Admin", "Merchant"],
    children: [
      {id: uuid(), link: "/dashboard/overview", name: "Admin Dashboard", roles: ["Admin"]},
      {id: uuid(), link: "/dashboard/analytics", name: "Analytics", roles: ["Admin", "Merchant"]},
      {id: uuid(), link: "/files/manager", name: "Files Manager", roles: ["Admin"]},
      {id: uuid(), link: "/sitereferences/charts", name: "Site Reference Analytics", roles: ["Admin", "Merchant"]},
    ],
  },
  {
    id: uuid(),
    title: "Appointment",
    icon: "calendar",
    roles: ["Admin", "User"],
    children: [{id: uuid(), link: "/appointments", name: "Create Appointment", roles: ["Admin", "User"]}],
  },
  {
    id: uuid(),
    title: "Blog",
    icon: "message-circle",
    roles: ["Admin", "User"],
    children: [
      {id: uuid(), link: "/blogs/new", name: "Create Blogs", roles: ["Admin"]},
      {id: uuid(), link: "/blogs", name: "Blogs", roles: ["Admin", "User"]},
    ],
  },
  {
    id: uuid(),
    title: "Borrower",
    icon: "users",
    roles: ["Admin"],
    children: [
      {id: uuid(), link: "/borrower/new", name: "Create Borrower", roles: ["Admin"]},
      {id: uuid(), link: "/borrowers/list", name: "Borrowers", roles: ["Admin"]},
    ],
  },
  {
    id: uuid(),
    title: "Business",
    icon: "briefcase",
    roles: ["Admin", "User"],
    children: [
      {id: uuid(), link: "/business/create", name: "Create Business", roles: ["Admin"]},
      {id: uuid(), link: "/business", name: "Business Profiles", roles: ["Admin", "User"]},
    ],
  },
  {
    id: uuid(),
    title: "Course",
    icon: "book",
    roles: ["Admin", "User"],
    children: [
      {
        id: uuid(),
        link: "/courses/lectures/create",
        name: "Create Lecture",
        roles: ["Admin"],
      },
      {
        id: uuid(),
        link: "/:lectureId/notes",
        name: "Create Notes",
        roles: ["Admin", "User"],
      },
      {
        id: uuid(),
        link: "/courses/lectures",
        name: "Lectures",
        roles: ["Admin", "User"],
      },
      {
        id: uuid(),
        title: "Tests",
        roles: ["Admin"],
        children: [
          {
            id: uuid(),
            link: "/test/builder",
            name: "Create Test",
            roles: ["Admin"],
          },
          {
            id: uuid(),
            link: "/test/instances",
            name: "View Test Instances",
            roles: ["Admin"],
          },
        ],
      },
      {
        id: uuid(),
        link: "/courses",
        name: "View Courses",
        roles: ["Admin", "User"],
      },
    ],
  },
  {
    id: uuid(),
    title: "FAQ",
    icon: "help-circle",
    roles: ["Admin"],
    children: [{id: uuid(), link: "/faqs/new", name: "Create FAQ", roles: ["Admin"]}],
  },
  {
    id: uuid(),
    title: "Forum",
    icon: "edit-3",
    roles: ["Admin", "User"],
    children: [
      {id: uuid(), link: "/forum/new", name: "Create Forum", roles: ["Admin"]},
      {id: uuid(), link: "/forum", name: "Forums", roles: ["Admin", "User"]},
    ],
  },
  {
    id: uuid(),
    title: "Lender",
    icon: "credit-card",
    roles: ["Admin", "User"],
    children: [
      {id: uuid(), link: "/lender/add", name: "Create Lenders", roles: ["Admin"]},
      {id: uuid(), link: "/lenders", name: "View Lenders", roles: ["Admin", "User"]},
    ],
  },
  {
    id: uuid(),
    title: "Loan Applications",
    icon: "file-text",
    roles: ["Admin"],
    children: [
      {id: uuid(), link: "/loan_application", name: "Create Loan Application", roles: ["Admin", "User"]},
      {id: uuid(), link: "/loanapplications/list", name: "View Loan Applications", roles: ["Admin"]},
    ],
  },
  {
    id: uuid(),
    title: "Location",
    icon: "map",
    roles: ["Admin"],
    children: [
      {id: uuid(), link: "/location/create", name: "Create Location", roles: ["Admin"]},
      {id: uuid(), link: "/location/view", name: "View Locations", roles: ["Admin"]},
    ],
  },
  {
    id: uuid(),
    title: "Stripe",
    icon: "dollar-sign",
    roles: ["Admin"],
    children: [{id: uuid(), link: "/stripe/dashboard", name: "Stripe Dashboard", roles: ["Admin", "User"]}],
  },
  {
    id: uuid(),
    title: "About MoneFi",
    grouptitle: true,
    roles: ["Admin", "User"],
  },
  {
    id: uuid(),
    title: "Guides & Resources",
    icon: "book-open",
    link: "/guide",
    roles: ["Admin", "User"],
  },
  {
    id: uuid(),
    title: "Newsletter",
    icon: "bell",
    link: "/newsletter/create",
    roles: ["Admin", "User"],
  },
  {
    id: uuid(),
    title: "Connect",
    grouptitle: true,
    roles: ["Admin", "User"],
  },
  {
    id: uuid(),
    title: "Contact Us",
    icon: "message-square",
    link: "/contact",
    roles: ["Admin", "User"],
  },
  {
    id: uuid(),
    title: "FAQs",
    icon: "help-circle",
    link: "/faqs",
    roles: ["Admin", "User"],
  },
  {
    id: uuid(),
    title: "Help Center",
    icon: "info",
    link: "/helpcenter",
    roles: ["Admin", "User"],
  },
  {
    id: uuid(),
    title: "Legal",
    grouptitle: true,
    roles: ["Admin", "User"],
  },
  {
    id: uuid(),
    title: "Privacy Policy",
    icon: "alert-circle",
    link: "/privacypolicy/",
    roles: ["Admin", "User"],
  },
];

export default DashboardMenu;
