
const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="pt-16 flex-grow"> {/* flex-grow will make this element expand to fill available space */}
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;