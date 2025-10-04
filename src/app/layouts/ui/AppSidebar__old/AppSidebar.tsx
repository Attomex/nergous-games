// import { useLocation, useNavigate } from "react-router-dom";
// import style from "./AppSidebar.module.css";
// import {
//     InformationCircleIcon,
//     ArrowLeftOnRectangleIcon,
//     WrenchScrewdriverIcon,
//     XMarkIcon,
// } from "@heroicons/react/24/outline";

// interface SidebarProps {
//     handleCloseMenu: () => void;
//     drawerOpen: boolean;
//     setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     isClosing: boolean;
//     iconMenuItems: { key: string; icon: React.ReactElement; label: string }[];
//     location: ReturnType<typeof useLocation>;
//     logout: () => void;
//     isAdmin: string | boolean;
// }

// export const AppSidebar: React.FC<SidebarProps> = (
//   {
//     handleCloseMenu,
//     drawerOpen,
//     setDrawerOpen,
//     isClosing,
//     iconMenuItems,
//     location,
//     logout,
//     isAdmin,
//   }
// ) => {
//     const navigate = useNavigate();

//     return (
//         <div className={`${style.drawerOverlay}`} onClick={handleCloseMenu}>
//             <div
//                 className={`${style.drawer} ${drawerOpen ? style["drawer-open"] : ""} ${isClosing ? style["drawer-closing"] : ""}`}
//                 onClick={(event) => event.stopPropagation()}
//             >
//                 <div className={style.drawerHeader}>
//                     <h2 className={style.drawerTitle}>Меню</h2>
//                     <button className={style.iconButton} onClick={handleCloseMenu}>
//                         <XMarkIcon className={style.icon} />
//                     </button>
//                 </div>
//                 <nav className={style.drawerBody}>
//                     <ul className={style.drawerList}>
//                         {iconMenuItems.map((item) => (
//                             <li key={item.key}>
//                                 <button
//                                     className={`${style.drawerListItem} ${location.pathname === item.key ? style.drawerListItemActive : ""}`}
//                                     onClick={() => {
//                                         navigate(item.key);
//                                         setDrawerOpen(false);
//                                     }}
//                                 >
//                                     <div className={style.drawerListItemIcon}>{item.icon}</div>
//                                     <span>{item.label}</span>
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                     <div className={style.drawerFooter}>
//                         <ul className={style.drawerList}>
//                             <li>
//                                 <button
//                                     className={`${style.drawerFooterItem} ${location.pathname === "/profile" ? style.drawerListItemActive : ""}`}
//                                     onClick={() => {
//                                         navigate("/profile");
//                                         setDrawerOpen(false);
//                                     }}
//                                 >
//                                     <div className={style.drawerListItemIcon}>
//                                         <InformationCircleIcon />
//                                     </div>
//                                     <span>Профиль</span>
//                                 </button>
//                             </li>
//                             <li>
//                                 {isAdmin && (
//                                     <button
//                                         className={`${style.drawerFooterItem} ${location.pathname === "/admin" ? style.drawerListItemActive : ""}`}
//                                         onClick={() => {
//                                             navigate("/admin");
//                                             setDrawerOpen(false);
//                                         }}
//                                     >
//                                         <div className={style.drawerListItemIcon}>
//                                             <WrenchScrewdriverIcon />
//                                         </div>
//                                         <span>Панель администратора</span>
//                                     </button>
//                                 )}
//                             </li>
//                             <li>
//                                 <button
//                                     className={`${style.drawerFooterItem} ${style.drawerFooterItemDanger}`}
//                                     onClick={() => {
//                                         logout();
//                                         navigate("/login");
//                                         setDrawerOpen(false);
//                                     }}
//                                 >
//                                     <div className={style.drawerListItemIcon}>
//                                         <ArrowLeftOnRectangleIcon />
//                                     </div>
//                                     <span>Выход</span>
//                                 </button>
//                             </li>
//                         </ul>
//                     </div>
//                 </nav>
//             </div>
//         </div>
//     );
// };

export const AppSidebar = () => {};