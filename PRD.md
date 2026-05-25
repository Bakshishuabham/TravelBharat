# Product Requirements Document (PRD) - TravelBharat

## 1. Project Overview
**TravelBharat** is a centralized tourism information web platform designed to serve as a digital travel encyclopedia of India. The platform structures state-wise and city-wise details of tourist destinations to help travelers, students, and researchers discover places, attractions, culture, and heritage easily.

## 2. Problem Statement
Travelers currently face scattered and inconsistent tourism information, making it difficult to find verified, structured, and state-wise tourist destinations in one place. This results in confusion, time loss, and poor trip planning.

## 3. Objectives
### Primary Objectives
- Create a single, structured platform for Indian tourist destinations.
- Organize destinations logically by State and City.
- Provide accurate, informative, and visually appealing travel details.

### Secondary Objectives
- Promote lesser-known Indian destinations.
- Support academic/tourism research.
- Encourage domestic tourism.

## 4. Scope
### In-Scope
- State and city-wise tourist destination listings.
- Detailed destination pages (description, category, best time to visit, entry fees, location).
- Search & Filter functionalities (by state, city, category).
- Image galleries for visual discovery.
- Secure Admin Panel for content management (CRUD for states, cities, categories, places).
- Responsive, mobile-first design.

### Out of Scope (Phase 1)
- Live bookings, payments, or ticketing.
- User reviews, comments, or social sharing interactions.
- Travel itinerary planner.

## 5. Functional Requirements
1. **State-Wise Destination Listing:** Browse tourist places by all 28 states and 8 Union Territories.
2. **Tourist Place Details:** Show historical significance, timings, entry fees, best time to visit, and nearby attractions.
3. **Search & Discovery:** Search destinations by keyword, or filter by category (e.g., Heritage, Nature, Adventure).
4. **Gallery & Media:** High-quality image previews for each destination.
5. **Admin Management:** Secure portal for admins to add, edit, or remove tourism content.

## 6. Non-Functional Requirements
- **Performance:** Page load time ≤ 2 seconds (optimized images, skeleton loaders).
- **Responsiveness:** Works seamlessly across mobile, tablet, and desktop.
- **SEO Optimization:** Dynamic page titles and semantic HTML.
- **Security:** JWT-based authentication for admin routes.
- **Scalability:** Built on the MERN stack for easy future expansion.

## 7. Technology Stack
- **Frontend:** React.js (Vite), Tailwind CSS, React Router, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose).
- **Deployment:** Vercel (Frontend), Render (Backend), MongoDB Atlas.

## 8. Expected Impact
- Simplified access to reliable Indian tourism information.
- Increased awareness of regional destinations.
- A strong, portfolio-grade project demonstrating full-stack engineering.
