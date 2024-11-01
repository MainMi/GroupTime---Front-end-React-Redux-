export const getFetchDispatch = (parameters, navigate, helpFn) => {
    return async (dispatch) => {
        try {
            const { url, method = 'GET', headers = {}, body = null } = parameters;

            const response = await fetch(url, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null,
            });
            const data = await response.json();
            console.log(data);
            
            if (!response.ok) {
                if (data.status === 401 && data.errorStatus === 4011) {
                    console.log('Please confirm email!');
                    navigate('/sign');
                    return;
                }
            }

            
            if (helpFn) {
                helpFn(data, navigate, dispatch);
            }
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
};

export const getFetch = async (parameters, navigate, helpFn) => {
    try {
        const { url, method = 'GET', headers = {}, body = null } = parameters;

        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            if (data.status === 401 && data.errorStatus === 4011) {
                console.log('Please confirm email!');
                navigate('/sign');
                return;
            }
        }


        if (helpFn) {
            helpFn(data, navigate);
        }
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};