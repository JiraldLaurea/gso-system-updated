import Axios from "axios";
import { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { Icon } from "@iconify/react";
import arraySort from "array-sort";
import { useSWRConfig } from "swr";

function UserTable({ filteredUsers, fetchUsers, userBarangays }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [dropdownMenuValueBarangay, setDropdownMenuValueBarangay] =
        useState("Barangay");
    const [dropdownMenuValueDistrict, setDropdownMenuValueDistrict] =
        useState("District");
    const [isAdmin, setIsAdmin] = useState(false);
    const [columnName, setColumnName] = useState("username");
    const [boolean, setBoolean] = useState(false);
    const { mutate } = useSWRConfig();

    const addUser = async (e) => {
        e.preventDefault();

        if (
            firstName != "" &&
            lastName != "" &&
            (dropdownMenuValueBarangay != "Barangay" ||
                dropdownMenuValueDistrict != "District" ||
                dropdownMenuValue == null) &&
            username != "" &&
            email != "" &&
            password != ""
        ) {
            if (password == confirmPassword) {
                const data = null;

                if (isAdmin) {
                    data = {
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        username: username.trim(),
                        email: email.trim(),
                        password: password,
                        barangayName: null,
                        isAdmin: isAdmin,
                    };
                } else {
                    data = {
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        username: username.trim(),
                        email: email.trim(),
                        password: password,
                        barangayName: dropdownMenuValueBarangay,
                        districtName: dropdownMenuValueDistrict,
                        isAdmin: isAdmin,
                    };
                }

                await Axios.post("http://localhost:3001/user", data).then(
                    (res) => {
                        console.log(res);
                        alert("Successfully added user");
                    }
                );

                setDropdownMenuValueBarangay("Barangay");
                setDropdownMenuValueDistrict("District");
                setFirstName("");
                setLastName("");
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                mutate("http://localhost:3001/user");
                mutate("http://localhost:3001/barangay");
            } else {
                alert("Password does not match");
            }
        } else {
            alert("Please fill in all the forms");
        }
    };

    const sort = (columnName) => {
        setColumnName(columnName);
        setBoolean(!boolean);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <form
                spellCheck="false"
                onSubmit={addUser}
                className="w-full mr-6 md:max-w-xs"
            >
                <p className="text-lg font-medium">Add user</p>
                <div
                    onClick={() => {
                        setIsAdmin(!isAdmin);
                        if (!isAdmin) {
                            setDropdownMenuValueBarangay(null);
                            setDropdownMenuValueDistrict(null);
                        }
                        if (isAdmin) {
                            setDropdownMenuValueBarangay("Barangay");
                            setDropdownMenuValueDistrict("District");
                        }
                    }}
                    className="flex items-center mt-6 mb-4 cursor-pointer w-fit"
                >
                    <p className="mr-2 text-sm text-gray-600">Admin</p>
                    <div
                        className={`flex items-center justify-center w-6 h-6 border  ${
                            isAdmin && "bg-blue-500 border-blue-500"
                        }`}
                    >
                        <Icon
                            className="w-5 h-5 text-white"
                            icon="ic:baseline-check"
                        />
                    </div>
                </div>

                <div className="my-4">
                    <p className="mb-1 text-sm text-gray-600">First name</p>
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 border"
                        type="text"
                        placeholder="First name"
                    />
                </div>

                <div className="my-4">
                    <p className="mb-1 text-sm text-gray-600">Last name</p>
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 border"
                        type="text"
                        placeholder="Last name"
                    />
                </div>

                {!isAdmin && (
                    <div className="my-4">
                        <p className="mb-1 text-sm text-gray-600">
                            Barangay - District
                        </p>
                        <div className="relative">
                            <ClickAwayListener
                                onClickAway={() => setIsDropdownMenuOpen(false)}
                                className="relative"
                            >
                                <div className="select-none w-fit">
                                    <div
                                        onClick={() =>
                                            setIsDropdownMenuOpen(
                                                !isDropdownMenuOpen
                                            )
                                        }
                                        className={`flex items-center justify-between w-56 px-3 py-2 border cursor-pointer`}
                                    >
                                        <p
                                            className={`${
                                                dropdownMenuValueBarangay ==
                                                    "Barangay" &&
                                                dropdownMenuValueDistrict ==
                                                    "District" &&
                                                "text-gray-400"
                                            }`}
                                        >
                                            {dropdownMenuValueBarangay}
                                            &nbsp;-&nbsp;
                                            {dropdownMenuValueDistrict}
                                        </p>
                                        <svg
                                            className="w-4 h-4 ml-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            ></path>
                                        </svg>
                                    </div>
                                    {isDropdownMenuOpen && (
                                        <div className="max-h-60 overflow-y-auto absolute z-10 py-4 bg-white border border-t-0 top-[42px] w-56 dark:bg-gray-700">
                                            <ul className="text-gray-700">
                                                {userBarangays.map(
                                                    (userBarangay, index) => {
                                                        return (
                                                            <li
                                                                key={index}
                                                                onClick={() => {
                                                                    setDropdownMenuValueBarangay(
                                                                        userBarangay.barangayName
                                                                    );
                                                                    setDropdownMenuValueDistrict(
                                                                        userBarangay.districtName
                                                                    );
                                                                    setIsDropdownMenuOpen(
                                                                        false
                                                                    );
                                                                }}
                                                            >
                                                                <a
                                                                    href="#"
                                                                    className="block px-3 py-2 hover:bg-gray-100"
                                                                >
                                                                    {
                                                                        userBarangay.barangayName
                                                                    }
                                                                    &nbsp; -
                                                                    &nbsp;
                                                                    {
                                                                        userBarangay.districtName
                                                                    }
                                                                </a>
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </ClickAwayListener>
                        </div>
                    </div>
                )}

                <div className="my-4">
                    <p className="mb-1 text-sm text-gray-600">Username</p>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border"
                        type="text"
                        placeholder="Username"
                    />
                </div>

                <div className="my-4">
                    <p className="mb-1 text-sm text-gray-600">Email</p>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border"
                        type="text"
                        placeholder="Email"
                    />
                </div>

                <div className="my-4">
                    <p className="mb-1 text-sm text-gray-600">Password</p>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border"
                        type="password"
                        placeholder="Password"
                    />
                </div>

                <div className="mt-4 mb-8">
                    <p className="mb-1 text-sm text-gray-600">
                        Confirm password
                    </p>
                    <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border"
                        type="password"
                        placeholder="Confirm password"
                    />
                </div>

                <div className="flex items-center justify-end mb-4">
                    <button
                        type="submit"
                        className="flex items-center justify-center px-4 py-2 text-white transition-colors bg-blue-500 border border-blue-500 rounded-sm hover:bg-blue-600"
                    >
                        <Icon
                            icon="ic:baseline-add-circle"
                            className="w-6 h-6 mr-2"
                        />
                        Add
                    </button>
                </div>
            </form>
            <div
                className={`overflow-auto border h-fit max-h-[500px] flex-grow ${
                    filteredUsers && "border-x border-t border-b-0"
                }`}
            >
                <div className="w-0 md:w-full">
                    <table className="text-sm text-left md:w-full">
                        <thead className="sticky top-0 text-xs text-gray-700 uppercase border-b h-11 bg-gray-50">
                            <tr className="removeBorderStyle">
                                <th className="px-6">
                                    <div
                                        onClick={() => sort("id")}
                                        className="flex items-center cursor-pointer group w-fit"
                                    >
                                        <p className="w-fit">No.</p>
                                        <Icon
                                            className={`w-5 h-5 invisible group-hover:visible `}
                                            icon={`${
                                                boolean == true
                                                    ? "eva:arrow-ios-downward-fill"
                                                    : "eva:arrow-ios-upward-fill"
                                            }`}
                                        />
                                    </div>
                                </th>
                                <th className="px-6">
                                    <div
                                        onClick={() => sort("firstName")}
                                        className="flex items-center cursor-pointer group w-fit"
                                    >
                                        <p className="w-fit">First Name</p>
                                        <Icon
                                            className={`w-5 h-5 invisible group-hover:visible `}
                                            icon={`${
                                                boolean == true
                                                    ? "eva:arrow-ios-downward-fill"
                                                    : "eva:arrow-ios-upward-fill"
                                            }`}
                                        />
                                    </div>
                                </th>
                                <th className="px-6">
                                    <div
                                        onClick={() => sort("lastName")}
                                        className="flex items-center cursor-pointer group w-fit"
                                    >
                                        <p className="w-fit">Last Name</p>
                                        <Icon
                                            className={`w-5 h-5 invisible group-hover:visible `}
                                            icon={`${
                                                boolean == true
                                                    ? "eva:arrow-ios-downward-fill"
                                                    : "eva:arrow-ios-upward-fill"
                                            }`}
                                        />
                                    </div>
                                </th>
                                <th className="px-6">
                                    <div
                                        onClick={() => sort("username")}
                                        className="flex items-center cursor-pointer group w-fit"
                                    >
                                        <p className="w-fit">Username</p>
                                        <Icon
                                            className={`w-5 h-5 invisible group-hover:visible `}
                                            icon={`${
                                                boolean == true
                                                    ? "eva:arrow-ios-downward-fill"
                                                    : "eva:arrow-ios-upward-fill"
                                            }`}
                                        />
                                    </div>
                                </th>
                                <th className="px-6">
                                    <div
                                        onClick={() => sort("email")}
                                        className="flex items-center cursor-pointer group w-fit"
                                    >
                                        <p className="w-fit">Email</p>
                                        <Icon
                                            className={`w-5 h-5 invisible group-hover:visible `}
                                            icon={`${
                                                boolean == true
                                                    ? "eva:arrow-ios-downward-fill"
                                                    : "eva:arrow-ios-upward-fill"
                                            }`}
                                        />
                                    </div>
                                </th>
                                <th className="px-6">
                                    <div
                                        onClick={() => sort("barangayName")}
                                        className="flex items-center cursor-pointer group w-fit"
                                    >
                                        <p className="w-fit">Barangay Name</p>
                                        <Icon
                                            className={`w-5 h-5 invisible group-hover:visible `}
                                            icon={`${
                                                boolean == true
                                                    ? "eva:arrow-ios-downward-fill"
                                                    : "eva:arrow-ios-upward-fill"
                                            }`}
                                        />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {arraySort(filteredUsers, columnName, {
                                reverse: boolean,
                            }).map((user, index) => {
                                if (user.barangayName == null) {
                                    user.barangayName = "-";
                                }
                                return (
                                    <tr
                                        key={index}
                                        className="border-b removeBorderStyle h-11"
                                    >
                                        <td className="px-6">{index + 1}</td>
                                        <td className="px-6">
                                            {user.firstName}
                                        </td>
                                        <td className="px-6">
                                            {user.lastName}
                                        </td>
                                        <td className="px-6">
                                            {user.username}
                                        </td>
                                        <td className="px-6">{user.email}</td>
                                        <td className="px-6">
                                            {user.barangayName}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UserTable;
