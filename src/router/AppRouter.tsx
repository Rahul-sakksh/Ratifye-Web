import React from "react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SolutionsDropdown from "../pages/Solutions/SolutionsPage";

const HomePage = lazy(() => import("../pages/Home/HomePage"));
const DynamicMultiBarcode = React.lazy(() => import("../pages/dynamicMultiBarcode"));
const MultiUrlBarcodePage = React.lazy(() => import("../pages/multiurl"));
const RequestForDemo = React.lazy(() => import("../pages/requestForDemo/index"));
const Pricing = React.lazy(() => import("../pages/pricing/index"));


export default function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Navigate to="/main/home" replace />} />
                    <Route path="/main/:page/:slug?" element={<HomePage />} />
                    <Route element={<MainLayout />}>
                        <Route path="/barcodeGen/:type?" element={<DynamicMultiBarcode />} />
                        <Route path="/multiurl" element={<MultiUrlBarcodePage />} />
                        <Route path="/requestForDemo" element={<RequestForDemo />} />
                        <Route path="/pricingByBCtype/:type" element={<Pricing />} />
                        <Route path="/RatifyeWebsite" element={<SolutionsDropdown />} />



                    </Route>




                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}