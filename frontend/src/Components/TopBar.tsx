import { Bell, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-4 py-3 d-flex justify-content-end align-items-center">
      <button className="btn btn-link text-dark p-2 position-relative">
        <Bell className="me-1" size={20} />
      </button>
      <button className="btn btn-link text-dark p-2 position-relative">
        <Settings className="me-1" size={20} />
      </button>
      <button className="btn btn-link text-dark p-2 position-relative" onClick={() => navigate("/")}>
        <LogOut className="me-1" size={20} />
      </button>
    </div>
  );
};

export default TopBar;
