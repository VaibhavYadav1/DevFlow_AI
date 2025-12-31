// "use client"

// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";

import UploadBox from "@/components/upload/upload_box";
// import { getStatus } from "@/api/fileApi"
// import { setParserID } from "@/store/features/fileSlice";

export default function uploadFilePage() {

    // const dispatch = useDispatch();

    // const taskId = useSelector((state: any) => state.taskId);

    // const [message, setMessage] = useState("");

    

    return (
        <>
            <UploadBox />

            {/* {message && (
                <div className="mt-4 rounded-md border border-green-400 bg-green-50 p-4 text-green-700">
                    {message}
                </div>
            )} */}

        </>
    );

}