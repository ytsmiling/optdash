function fetch_data(base_uri: string, query_params: string | string[][], data_setter: (x: any) => void, key: string = "") {
    let qs = new URLSearchParams(query_params);
    let uri = base_uri + "?" + qs.toString();
    console.log("Fetching " + uri);
    fetch(uri)
        .then(res => res.json())
        .then(
            (result) => {
                if (key === "") {
                    data_setter(result);
                } else {
                    data_setter(result[key]);
                }
                console.log("Fetch success: " + uri);
            },
            (error) => {
                console.log("Fetch failed: " + uri + " " + error);
            }
        )
}

export default fetch_data;