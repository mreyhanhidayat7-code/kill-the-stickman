export default async function handler(req, res) {

    if (req.method !== "GET") {

        return res
            .status(405)
            .json({
                error:
                    "Method not allowed"
            });
    }


    try {

        const googleUrl =
            process.env
            .GOOGLE_APPS_SCRIPT_URL;


        if (!googleUrl) {

            return res
                .status(503)
                .json({
                    error:
                        "Google Sheets belum dikonfigurasi"
                });
        }


        const response =
            await fetch(
                googleUrl +
                "?action=leaderboard"
            );


        if (!response.ok) {

            return res
                .status(502)
                .json({
                    error:
                        "Google Sheets error"
                });
        }


        const data =
            await response.json();


        return res
            .status(200)
            .json(
                Array.isArray(data)
                    ? data
                    : []
            );


    } catch (error) {

        return res
            .status(500)
            .json({
                error:
                    "Server error"
            });
    }
}
