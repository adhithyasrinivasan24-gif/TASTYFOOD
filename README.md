# FreshBite — Experiment 5: REST API Integration

This project combines Experiment 4's demo authentication, protected routes, reusable components, checkout validation and error boundary with REST API integration for food menu and individual food details.

## Run
1. Extract the ZIP and open this folder in VS Code.
2. Run `npm install`.
3. Run `npm run dev` and open the localhost URL shown by Vite.
4. A working internet connection is needed to retrieve food data from the public DummyJSON Recipes REST API (`https://dummyjson.com/recipes`).

## API implementation
- `src/services/foodApi.js`: uses the browser Fetch API, checks `response.ok`, parses JSON, normalizes API recipes into the app's food shape, fetches the menu and fetches a single recipe by ID.
- `src/hooks/useFoodMenu.js`: calls the API using `async/await` inside `useEffect`, stores menu/loading/error/search/category state, and uses `useMemo` to derive categories and filtered data.
- `src/pages/FoodMenuPage.jsx`: displays loading, API error/retry, empty search results, category selection, search field and food cards.
- `src/pages/FoodDetailsPage.jsx`: reads the dynamic ID with `useParams` and fetches the individual food from the API with `useEffect` and `async/await`.
- `src/components/FoodCard.jsx`: reusable API-data card used on the Home and Menu pages.

## Files added newly compared with Experiment 4
| New file | Purpose |
|---|---|
| `src/services/foodApi.js` | Fetch API service functions for menu and individual recipe requests; response/error handling and API data normalization. |
| `src/hooks/useFoodMenu.js` | Asynchronous menu loading, loading/error state, search and category filtering. |
| `src/pages/FoodMenuPage.jsx` | API-driven menu, search, category filter, loading/error/empty states. |
| `src/pages/FoodDetailsPage.jsx` | Fetches one food item by dynamic route ID. |
| `src/pages/HomePage.jsx` | Landing page with reusable FoodCard items from API data. |
| `src/components/FoodCard.jsx` | Reusable card with details link and add-to-cart behavior. |
| `src/data/fallbackFoods.js` | Small sample data reference for offline/local experimentation (the menu intentionally reports API errors instead of silently pretending stale data came from the API). |
| `src/components/Loading.jsx` | Reusable loading indicator. |
| `src/components/Header.jsx` | Navigation and cart/auth controls. |
| `src/components/Footer.jsx` | Shared footer. |
| `src/components/Button.jsx` | Reusable button. |
| `src/components/Input.jsx` | Reusable labelled input with error message. |
| `src/components/ProtectedRoute.jsx` | Protected route wrapper retained for the Experiment 4 flow. |
| `src/components/ErrorBoundary.jsx` | Render error fallback retained from Experiment 4. |
| `src/pages/LoginPage.jsx` | Demo login and return-to-requested-route behavior. |
| `src/pages/CartPage.jsx` | Protected cart page. |
| `src/pages/CheckoutPage.jsx` | Protected checkout with field validation and demo order creation. |
| `src/pages/OrderConfirmationPage.jsx` | Order confirmation. |
| `src/pages/OrdersPage.jsx` | Nested orders overview/current/history pages. |
| `src/pages/NotFoundPage.jsx` | Unknown route page. |
| `src/context/AuthContext.jsx` | Authentication context. |
| `src/context/CartContext.jsx` | Cart context and calculated totals. |
| `src/main.jsx` | React application entry point. |
| `src/styles.css` | Responsive styling. |
| `src/App.jsx` | Route/provider composition. |
| `index.html`, `vite.config.js`, `package.json` | Vite project setup. |

> Since the previous Experiment 4 ZIP was not present in the active workspace when this package was prepared, this archive is a complete rebuilt FreshBite project, not a binary patch of the earlier ZIP. It recreates the Experiment 4 functionality and adds Experiment 5. No files are intentionally deleted in this package.

## Files modified compared with Experiment 4 conceptually
| File | Experiment 5 change |
|---|---|
| `src/App.jsx` | Loads the menu hook and passes API data into Home and Menu; routes API-based food details. |
| `src/pages/HomePage.jsx` | Shows reusable FoodCard components from API-loaded food data. |
| `src/pages/FoodMenuPage.jsx` | Search and category filters now use API data and render loading/error/empty states. |
| `src/pages/FoodDetailsPage.jsx` | Fetches one recipe from the REST API using the dynamic route ID. |
| `src/components/FoodCard.jsx` | Displays API recipe data and links to dynamic details. |
| `src/styles.css` | Adds API loading, error, empty results and responsive menu styles. |
| `README.md` | Documents Experiment 5 API setup and procedure map. |

## Files required for each procedure (a–g)
| Procedure | Required files | What they implement |
|---|---|---|
| **(a) Integrate REST API** | `src/services/foodApi.js`, `src/hooks/useFoodMenu.js` | Fetches menu JSON from the DummyJSON recipes endpoint and maps API results to app food objects. |
| **(b) Fetch on application load with useEffect** | `src/hooks/useFoodMenu.js`, `src/App.jsx` | `useEffect` starts the asynchronous menu request when the app mounts. |
| **(c) Use async/await** | `src/services/foodApi.js`, `src/hooks/useFoodMenu.js`, `src/pages/FoodDetailsPage.jsx` | Performs asynchronous HTTP requests and handles response/errors. |
| **(d) Render reusable FoodCard** | `src/components/FoodCard.jsx`, `src/pages/FoodMenuPage.jsx`, `src/pages/HomePage.jsx` | Renders each API food item through a reusable card. |
| **(e) Search and category filtering** | `src/hooks/useFoodMenu.js`, `src/pages/FoodMenuPage.jsx` | Filters fetched food data by name/description and API-derived category. |
| **(f) Loading and error messages** | `src/hooks/useFoodMenu.js`, `src/pages/FoodMenuPage.jsx`, `src/components/Loading.jsx`, `src/services/foodApi.js` | Shows loading, HTTP/network error, retry and no-results messages. |
| **(g) Fetch individual food details** | `src/services/foodApi.js`, `src/pages/FoodDetailsPage.jsx`, `src/App.jsx` | Uses `/food/:id`, `useParams()`, `fetchFoodById()` and `useEffect` to request one recipe. |

## Testing
- Open `/menu`; wait for the API response and verify cards appear.
- Search for a recipe name and select a category; verify results update.
- Open a card to test `/food/:id` and the individual recipe request.
- Turn off the network and reload `/menu` to test the error message and Retry button.
- Add a food item to cart; opening `/cart` while signed out redirects to Login. Demo login accepts a valid username/email and password of at least six characters.

## Scope note
Authentication and checkout are frontend demonstrations. No real payment is processed. The API is a public third-party demo endpoint; menu availability depends on the internet and that service.


## Experiment 2 extension: Zustand global cart state
This version extends the Experiment 5 FreshBite project with Zustand. The cart is managed globally (no CartProvider), actions are logged by custom middleware, totals are calculated from cart items, and Zustand persist synchronizes cart items with browser localStorage. The existing API menu/detail fetching and loading/error states from Experiment 5 remain.

### Files changed for Experiment 2
- **Modified:** `package.json` (added Zustand), `src/App.jsx` (removed CartProvider), `src/components/FoodCard.jsx`, `src/components/Header.jsx`, `src/pages/CartPage.jsx`, `src/pages/CheckoutPage.jsx`, `src/pages/FoodDetailsPage.jsx` (use the Zustand store).
- **Added:** `src/store/cartStore.js` (global store, cart actions, derived totals, logging middleware, persistence).
- **Deleted:** `src/context/CartContext.jsx` (replaced by Zustand store). No other files are intentionally deleted.

### Procedure-to-file mapping (a–g)
- **(a) Global store for food items/cart:** `src/store/cartStore.js`, `src/services/foodApi.js`, `src/hooks/useFoodMenu.js`. Menu data is fetched by the existing API hook; cart state is global in Zustand.
- **(b) add/remove/update/clear operations:** `src/store/cartStore.js`; invoked by `src/components/FoodCard.jsx`, `src/pages/FoodDetailsPage.jsx`, `src/pages/CartPage.jsx`, and `src/pages/CheckoutPage.jsx`.
- **(c) Zustand store:** `src/store/cartStore.js`, `package.json`, `src/App.jsx`.
- **(d) Subtotal, tax, total (derived state):** `calculateCartSummary()` in `src/store/cartStore.js`; displayed in `src/pages/CartPage.jsx` and `src/pages/CheckoutPage.jsx`. Tax is 5%; delivery is free for subtotal ≥ ₹500, otherwise ₹35.
- **(e) Middleware to monitor/process cart actions:** `logCartActions` in `src/store/cartStore.js`; check the browser developer console for action names.
- **(f) Browser storage synchronization:** `persist` and `createJSONStorage` in `src/store/cartStore.js`; storage key is `freshbite-cart`.
- **(g) Empty/loading states:** empty-cart UI in `src/pages/CartPage.jsx` and `src/pages/CheckoutPage.jsx`; food API loading states remain in `src/hooks/useFoodMenu.js`, `src/pages/FoodMenuPage.jsx`, `src/pages/FoodDetailsPage.jsx`, and `src/components/Loading.jsx`. The cart store also includes `isCartLoading`/`setCartLoading` for future cart-specific async work.

### Run
Run `npm install` and then `npm run dev`. The food API requires an internet connection. Cart state persists in browser storage. This is a learning/demo application; checkout does not collect real payments.

## Experiment 3 — Product CRUD Operations using APIs

Open **Manage Foods** in the navigation or visit `/manage-foods`.

- **GET:** loads food products from `https://dummyjson.com/recipes`.
- **POST:** add a product using the form.
- **PUT:** choose Edit, change fields, and save.
- **DELETE:** choose Delete and confirm.
- Requests use `async/await`, with loading indicators and error/success messages.
- The API is a demo: DummyJSON simulates create/update/delete responses; these mutations are not permanently stored by its server. The page reflects successful mutations locally until it reloads.

### Experiment 3 files

**Added:** `src/services/foodCrudApi.js` (GET/POST/PUT/DELETE API calls), `src/pages/FoodManagementPage.jsx` (CRUD UI, form validation, async/loading/error states).

**Modified:** `src/App.jsx` (route), `src/components/Header.jsx` (Manage Foods navigation), `src/styles.css` (CRUD page styling), `README.md` (instructions).

**Deleted:** none.

### Procedure-to-file map (a–g)

- **a) GET products:** `src/services/foodCrudApi.js`, `src/pages/FoodManagementPage.jsx`
- **b) POST/add products:** `src/services/foodCrudApi.js`, `src/pages/FoodManagementPage.jsx`
- **c) PUT/update products:** `src/services/foodCrudApi.js`, `src/pages/FoodManagementPage.jsx`
- **d) DELETE products:** `src/services/foodCrudApi.js`, `src/pages/FoodManagementPage.jsx`
- **e) Handle async responses:** `src/services/foodCrudApi.js`, `src/pages/FoodManagementPage.jsx`
- **f) Loading indicators:** `src/pages/FoodManagementPage.jsx`, `src/components/Loading.jsx`, `src/styles.css`
- **g) API errors/messages:** `src/services/foodCrudApi.js`, `src/pages/FoodManagementPage.jsx`, `src/styles.css`

Run `npm install` then `npm run dev`.

## Experiment 4 — API Authentication and Token Management

- Login uses `POST https://dummyjson.com/auth/login` with a username and password.
- The access token is stored in `localStorage` as `freshbite-token`; the basic user profile is stored as `freshbite-user`.
- `src/services/apiClient.js` is the shared Axios instance. Its request interceptor attaches `Authorization: Bearer <token>` and its response interceptor broadcasts a session-expired event for HTTP 401 responses.
- `src/context/AuthContext.jsx` handles login, persistence, logout, and expired-session cleanup.
- `/cart`, `/checkout`, `/order-confirmation`, and `/orders/*` are protected by `src/components/ProtectedRoute.jsx`.
- Food CRUD API requests use the shared Axios client, so the interceptor attaches the token when available.
- Logout removes the token and user profile from browser storage.

### Experiment 4 procedure-to-file mapping

| Procedure | Files |
|---|---|
| (a) API login component | `src/pages/LoginPage.jsx`, `src/context/AuthContext.jsx` |
| (b) Store token after login | `src/context/AuthContext.jsx` |
| (c) Token on authenticated requests | `src/services/apiClient.js`, `src/services/foodCrudApi.js` |
| (d) Axios interceptors | `src/services/apiClient.js` |
| (e) Protect cart, checkout, orders | `src/components/ProtectedRoute.jsx`, `src/App.jsx` |
| (f) Logout and token removal | `src/context/AuthContext.jsx`, `src/components/Header.jsx` |
| (g) Invalid/expired token handling | `src/services/apiClient.js`, `src/context/AuthContext.jsx`, `src/pages/LoginPage.jsx`, `src/services/foodCrudApi.js` |

### Authentication demo

Use a valid account supported by the DummyJSON authentication API. Authentication needs internet access. DummyJSON is a demonstration service; its tokens and product operations are not a substitute for a production authentication backend. A 401 response clears the local session and protected routes return to sign-in.

# Experiment 1 — Component Testing (continued from Experiment 4)

This continuation adds Jest and React Testing Library tests for the existing FreshBite food ordering application. The authentication, CRUD, REST API, and Zustand cart features from earlier experiments are retained.

## Test setup

- `babel.config.cjs` — transforms JSX and modern JavaScript for Jest.
- `jest.config.cjs` — configures the jsdom test environment and test discovery.
- `src/tests/setupTests.js` — loads `@testing-library/jest-dom` matchers.
- `src/tests/styleMock.cjs` — mock for imported styles.
- `src/tests/FoodCard.test.jsx` — checks food rendering and add-to-cart action.
- `src/tests/FoodMenuPage.test.jsx` — checks food rendering, search/category control callbacks, loading and error UI.
- `src/tests/CartPage.test.jsx` — checks empty cart, totals, quantity updates, and item removal.

## Procedures (a–g) and files

(a) Test cases for FoodCard, FoodList/menu, and Cart: `src/tests/FoodCard.test.jsx`, `src/tests/FoodMenuPage.test.jsx`, `src/tests/CartPage.test.jsx`.

(b) Food information rendering: `src/tests/FoodCard.test.jsx`, `src/tests/FoodMenuPage.test.jsx`.

(c) Search and category controls: `src/tests/FoodMenuPage.test.jsx`, `src/pages/FoodMenuPage.jsx`, `src/hooks/useFoodMenu.js`.

(d) Add/remove cart actions: `src/tests/FoodCard.test.jsx`, `src/tests/CartPage.test.jsx`, `src/store/cartStore.js`.

(e) Jest unit testing: `package.json`, `babel.config.cjs`, `jest.config.cjs`.

(f) React Testing Library rendering and interactions: all three `src/tests/*.test.jsx` files and `src/tests/setupTests.js`.

(g) Verify test results: run `npm test`; Jest prints passed/failed suites and assertions in the terminal.

## Run tests

```bash
npm install
npm test
```

To watch tests while editing:

```bash
npm run test:watch
```

The tests use mocked cart/menu data for predictable component tests; they do not require the external food API. They verify the components' rendered output and event callbacks, while API integration can be tested separately.
# TASTYFOOD
