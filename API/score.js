export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res
            .status(405)
            .json({
                error:
                    "Method not allowed"
            });
    }


    try {

        const {
            username,
            score
        } = req.body || {};


        if (
            !username ||
            !Number.isFinite(
                Number(score)
            )
        ) {

            return res
                .status(400)
                .json({
                    error:
                        "Data tidak valid"
                });
        }


        const cleanUsername =
            String(username)
            .replace(
                /[^\w .-]/g,
                ""
            )
            .slice(
                0,
                20
            );


        const cleanScore =
            Math.max(
                0,
                Math.floor(
                    Number(score)
                )
            );


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
                googleUrl,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            action:
                                "save",

                            username:
                                cleanUsername,

                            score:
                                cleanScore

                        })
                }
            );


        if (!response.ok) {

            return res
                .status(502)
                .json({
                    error:
                        "Google Sheets error"
                });
        }


        return res
            .status(200)
            .json({
                ok: true
            });


    } catch (error) {

        return res
            .status(500)
            .json({
                error:
                    "Server error"
            });
    }
}
