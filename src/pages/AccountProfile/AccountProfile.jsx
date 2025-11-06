import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../../components/Header/Header";
import { Edit, Save, Lock, XCircle } from "lucide-react"; // icon đẹp từ lucide-react
import { Col, Row } from "react-bootstrap";
import { Form } from "react-router-dom";

const AccountProfile = () => {
    const { user, login } = useContext(AuthContext);
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

    useEffect(() => {
        if (user) setFormData(user);
    }, [user]);

    if (!user) {
        return <h2 className="text-center mt-5">Please log in to view your profile.</h2>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const res = await fetch(`http://localhost:9999/accounts/${formData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Failed to update profile");
            const updatedUser = await res.json();
            alert("Profile updated successfully! 💪");
            setIsEditing(false);
            login(updatedUser);
        } catch (error) {
            console.error(error);
            alert("Error updating profile 😢");
        }
    };

    const handlePasswordChange = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        try {
            const res = await fetch(`http://localhost:9999/accounts/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: passwords.newPassword }),
            });
            if (!res.ok) throw new Error("Failed to update password");
            alert("Password changed successfully! 🔐");
            setShowPasswordForm(false);
            setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.error(err);
            alert("Error changing password!");
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex justify-center items-center bg-[#f5deb3]">
                <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-yellow-200">
                    <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                        🌻 Account Profile 🌻
                    </h2>

                    {formData && (
                        <div style={{ textAlign: 'center' }} >
                            {["username", "email", "phoneNumber", "address"].map((field) => (
                                <div key={field}>
                                    <Row style={{ width: '500px', textAlign: 'center', marginLeft: '600px' }}>
                                        <label style={{ textAlign: 'center' }} className="font-semibold text-start capitalize">{field}</label>
                                        <input
                                            type={field === "email" ? "email" : "text"}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="border border-gray-300 w-full p-2 rounded-lg focus:outline-none focus:ring-2 "
                                        />
                                    </Row>


                                </div>
                            ))}

                            <Row style={{ width: '500px', textAlign: 'center', marginLeft: '600px' }}>
                                <label style={{ textAlign: 'center' }} className="font-semibold text-start capitalize">Role</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    disabled
                                    className="border border-gray-200 w-full p-2 rounded-lg bg-gray-100"
                                />
                            </Row>

                            <Row style={{ width: '500px', textAlign: 'center', marginLeft: '600px' }}>
                                <label style={{ textAlign: 'center' }} className="font-semibold text-start capitalize">Status</label>
                                <input
                                    type="text"
                                    value={formData.status}
                                    disabled
                                    className="border border-gray-200 w-full p-2 rounded-lg bg-gray-100"
                                />
                            </Row>

                            <div style={{ marginTop: '30px' }} className="flex justify-center gap-5 mt-6">
                                {!isEditing ? (
                                    <>
                                        <button
                                            style={{ marginRight: '20px', borderRadius: '10px', backgroundColor: 'orange' }}
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-xl hover:bg-yellow-500 transition-all shadow-md"
                                        >
                                            <Edit size={18} /> Edit Info
                                        </button>
                                        <button
                                            style={{ borderRadius: '10px', backgroundColor: 'green' }}
                                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                                            className="flex items-center gap-2 bg-yellow-300 text-black font-semibold px-4 py-2 rounded-xl hover:bg-yellow-400 transition-all shadow-md"
                                        >
                                            <Lock size={18} /> Change Password
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            style={{ borderRadius: '10px', backgroundColor: 'green', marginRight: '10px' }}
                                            onClick={handleSave}
                                            className="flex items-center gap-2 bg-green-400 text-black font-semibold px-4 py-2 rounded-xl hover:bg-green-500 transition-all shadow-md"
                                        >
                                            <Save size={18} /> Save
                                        </button>
                                        <button
                                            style={{ borderRadius: '10px', backgroundColor: 'red' }}
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData(user);
                                            }}
                                            className="flex items-center gap-2 bg-gray-300 text-black font-semibold px-4 py-2 rounded-xl hover:bg-gray-400 transition-all shadow-md"
                                        >
                                            <XCircle size={18} /> Cancel
                                        </button>
                                    </>
                                )}
                            </div>

                            {showPasswordForm && (
                                <div className="mt-6 border-t border-yellow-300 pt-4">
                                    <h3 className="text-xl font-bold mb-3 text-center text-gray-700">
                                        Change Password 🔐
                                    </h3>

                                    {["oldPassword", "newPassword", "confirmPassword"].map((field) => (
                                        <input
                                            style={{ marginLeft: '10px', width: '300px' }}
                                            key={field}
                                            type="password"
                                            placeholder={
                                                field === "confirmPassword"
                                                    ? "Confirm New Password"
                                                    : field === "newPassword"
                                                        ? "New Password"
                                                        : "Old Password"
                                            }
                                            value={passwords[field]}
                                            onChange={(e) =>
                                                setPasswords({ ...passwords, [field]: e.target.value })
                                            }
                                            className="border border-gray-300 w-full p-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                        />
                                    ))}

                                    <div className="flex justify-center gap-3">
                                        <button
                                            style={{ borderRadius: '10px', backgroundColor: 'green', marginRight: '10px' }}
                                            onClick={handlePasswordChange}
                                            className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-xl hover:bg-yellow-500 transition-all shadow-md"
                                        >
                                            <Save size={18} /> Save Password
                                        </button>
                                        <button
                                            style={{ borderRadius: '10px', backgroundColor: 'red' }}
                                            onClick={() => setShowPasswordForm(false)}
                                            className="flex items-center gap-2 bg-gray-300 text-black font-semibold px-4 py-2 rounded-xl hover:bg-gray-400 transition-all shadow-md"
                                        >
                                            <XCircle size={18} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AccountProfile;
