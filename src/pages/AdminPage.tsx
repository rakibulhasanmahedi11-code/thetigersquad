import Navbar from "@/components/Navbar";
import LoginSection from "@/components/LoginSection";
import FooterSection from "@/components/FooterSection";

const AdminPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <LoginSection />
    </div>
    <FooterSection />
  </div>
);

export default AdminPage;
