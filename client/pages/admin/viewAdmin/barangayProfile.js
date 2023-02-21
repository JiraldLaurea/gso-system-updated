import React, { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import Axios from "axios";
import fileDownload from "js-file-download";
import { Document, Page } from "react-pdf";
import { getStorage, ref } from "firebase/storage";
import { storage } from "../../../firebase";
import useSWR from "swr";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useAuthDispatch } from "../../../context/auth";
import DownloadButton from "../../../components/DownloadButton";
import ViewButton from "../../../components/ViewButton";
import EditButton from "../../../components/EditButton";

function barangayProfile() {
    const router = useRouter();
    const [barangayYears, setBarangayYears] = useState([]);
    const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
    const [isDropdownMenuOpen2, setIsDropdownMenuOpen2] = useState(false);
    const [dropdownMenuValue, setDropdownMenuValue] = useState("Year");
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [submissionBarangayProfileUrl, setSubmissionBarangayProfileUrl] =
        useState();
    const [dropdownMenuValueBarangay, setDropdownMenuValueBarangay] =
        useState("Barangay");
    const [dropdownMenuValueDistrict, setDropdownMenuValueDistrict] =
        useState("District");
    const [yearOfSubmission, setYearOfSubmission] =
        useState("Year of submission");
    const [barangayId, setBarangayId] = useState(null);
    const storage = getStorage();
    const dispatch = useAuthDispatch();

    useEffect(() => {
        dispatch("CHANGE_TITLE", "Barangay profile");
        dispatch("HAS_BUTTON_TRUE");
        dispatch("CHANGE_PATH", "/admin/viewAdmin");
    }, []);

    const { data: barangays } = useSWR(
        "http://localhost:3001/shortenedSubmission/getAllUpdatedBarangayProfile"
    );

    const displayYearSubmitted = async () => {
        const data = {
            barangayId: barangayId,
        };

        await Axios.post(
            "http://localhost:3001/shortenedSubmission/getAllUpdatedBarangayProfileYearSubmitted",
            data
        ).then((res) => {
            setBarangayYears(res.data);
        });
    };

    useEffect(() => {
        if (barangayId != null) {
            displayYearSubmitted();
        }
    }, [barangayId]);

    const download = async () => {
        if (!loadingDownload) {
            setLoadingDownload(true);

            const data = {
                barangayId: barangayId,
                selectedBarangay: dropdownMenuValueBarangay,
                selectedDistrict: dropdownMenuValueDistrict,
            };

            const dataYearOfSubmission = {
                yearOfSubmission: yearOfSubmission,
            };

            await Axios.post(
                "http://localhost:3001/barangay/postSelectedBarangay",
                data
            );

            await Axios.post(
                "http://localhost:3001/shortenedSubmission/getUpdatedBarangayProfileUrl",
                dataYearOfSubmission
            ).then((res) => {
                const documentName = res.data.documentName;
                Axios({
                    url: "http://localhost:3001/download",
                    method: "POST",
                    responseType: "blob",
                    data: {
                        submissionUrl: res.data.submissionBarangayProfileUrl,
                    },
                }).then((res) => {
                    fileDownload(res.data, documentName);
                    setLoadingDownload(false);
                });
            });
        }
    };

    const editSelectedBarangay = async () => {
        const data = {
            barangayId: barangayId,
            selectedBarangay: dropdownMenuValueBarangay,
            selectedDistrict: dropdownMenuValueDistrict,
            yearSubmitted: yearOfSubmission,
        };

        const actionData = {
            action: "EditSubmission",
            barangayId: barangayId,
        };

        await Axios.post(
            "http://localhost:3001/barangay/postSelectedBarangayWithYearSubmitted",
            data
        );

        await Axios.put(
            "http://localhost:3001/submission/updateAction",
            actionData
        );

        await Axios.post(
            "http://localhost:3001/shortenedSubmission/getSubmissionWithYearSubmitted",
            { barangayId: barangayId, yearSubmitted: yearOfSubmission }
        ).then((res) => {
            const isShortened = res.data.isShortened;
            if (isShortened) {
                router.push("/admin/viewAdmin/barangayProfile/template");
            } else {
                router.push("/admin/viewAdmin/barangayProfile/templateEncoded");
            }
        });
    };

    const view = async (e) => {
        const data = {
            barangayId: barangayId,
            selectedBarangay: dropdownMenuValueBarangay,
            selectedDistrict: dropdownMenuValueDistrict,
        };

        const dataYearOfSubmission = {
            yearOfSubmission: yearOfSubmission,
        };

        await Axios.post(
            "http://localhost:3001/barangay/postSelectedBarangay",
            data
        );

        await Axios.post(
            "http://localhost:3001/shortenedSubmission/getUpdatedBarangayProfileUrl",
            dataYearOfSubmission
        ).then((res) => {
            setSubmissionBarangayProfileUrl(
                res.data.submissionBarangayProfileUrl
            );
        });
    };

    return (
        <div className="flex flex-col w-full ">
            <div className="p-4 md:p-8">
                <div className="mb-4">
                    <div className="flex flex-col md:flex-row md:items-end">
                        <div>
                            <p className="mb-1 text-sm text-gray-600">
                                Barangay and district
                            </p>
                            <div className="relative">
                                <ClickAwayListener
                                    onClickAway={() =>
                                        setIsDropdownMenuOpen(false)
                                    }
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
                                            <div className="max-h-60 overflow-y-auto absolute z-10 py-4 bg-white border border-t-0 top-[42px] w-56 dark:bg-gray-700 shadow-lg">
                                                <ul className="text-gray-700 bg-white">
                                                    {barangays.map(
                                                        (barangay, index) => {
                                                            return (
                                                                <li
                                                                    key={index}
                                                                    onClick={() => {
                                                                        setYearOfSubmission(
                                                                            "Year of submission"
                                                                        );
                                                                        setDropdownMenuValueBarangay(
                                                                            barangay.barangayName
                                                                        );
                                                                        setDropdownMenuValueDistrict(
                                                                            barangay.districtName
                                                                        );
                                                                        setBarangayId(
                                                                            barangay.barangayId
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
                                                                            barangay.barangayName
                                                                        }
                                                                        &nbsp; -
                                                                        &nbsp;
                                                                        {
                                                                            barangay.districtName
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
                        <div className="my-4 md:ml-4 md:my-0">
                            <p className="mb-1 text-sm text-gray-600">
                                Year of submission
                            </p>
                            <div className="relative">
                                <ClickAwayListener
                                    onClickAway={() =>
                                        setIsDropdownMenuOpen2(false)
                                    }
                                    className="relative"
                                >
                                    <div className="select-none w-fit">
                                        <div
                                            onClick={() =>
                                                setIsDropdownMenuOpen2(
                                                    !isDropdownMenuOpen2
                                                )
                                            }
                                            className={`flex items-center justify-between w-56 px-3 py-2 border cursor-pointer`}
                                        >
                                            <p
                                                className={`${
                                                    yearOfSubmission ==
                                                        "Year of submission" &&
                                                    "text-gray-400"
                                                }`}
                                            >
                                                {yearOfSubmission}
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
                                        {isDropdownMenuOpen2 && (
                                            <div className="max-h-60 overflow-y-auto absolute z-10 py-4 bg-white border border-t-0 top-[42px] w-56 dark:bg-gray-700 shadow-lg">
                                                <ul className="text-gray-700 bg-white">
                                                    {barangayYears.map(
                                                        (
                                                            barangayYear,
                                                            index
                                                        ) => {
                                                            return (
                                                                <li
                                                                    key={index}
                                                                    onClick={() => {
                                                                        setYearOfSubmission(
                                                                            barangayYear.yearSubmitted
                                                                        );
                                                                        setIsDropdownMenuOpen2(
                                                                            false
                                                                        );
                                                                    }}
                                                                >
                                                                    <a
                                                                        href="#"
                                                                        className="block px-3 py-2 hover:bg-gray-100"
                                                                    >
                                                                        {
                                                                            barangayYear.yearSubmitted
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

                        {dropdownMenuValueBarangay != "Barangay" &&
                            yearOfSubmission != "Year of submission" && (
                                <>
                                    <ViewButton view={view} />
                                    <EditButton
                                        editSelectedBarangay={
                                            editSelectedBarangay
                                        }
                                    />
                                    <DownloadButton
                                        download={download}
                                        loadingDownload={loadingDownload}
                                    />
                                </>
                            )}
                    </div>
                </div>

                {submissionBarangayProfileUrl && (
                    <iframe
                        className="w-full h-[800px]"
                        src={`${submissionBarangayProfileUrl}`}
                    ></iframe>
                )}
            </div>
        </div>
    );
}

export default barangayProfile;
