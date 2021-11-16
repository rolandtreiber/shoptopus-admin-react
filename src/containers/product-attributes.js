import React, {useCallback, useContext, useEffect, useState} from 'react'
import {useMounted} from "../hooks/use-mounted";
import {useSelection} from "../hooks/use-selection";
import {APIContext} from "../contexts/api-context";

const ProductAttributes = () => {
    const [attributes, setAttributes] = useState({isLoading: true})
    const mounted = useMounted();
    const [controller, setController] = useState({
        filters: [],
        page: 0,
        query: '',
        sort: 'desc',
        sortBy: 'updated_at',
        view: 'all'
    });
    const [
        selectedCategories,
        handleSelect,
        handleSelectAll
    ] = useSelection(attributes.data?.attributes);
    // const [openCreateDialog, setOpenCreateDialog] = useState(false);

    const {fetchProductAttributes} = useContext(APIContext)

    const getAttributes = useCallback(async () => {
        setAttributes(() => ({ isLoading: true }));

        try {
            const result = await fetchProductAttributes({
                page: controller.page,
                paginate: 20,
                sort_by_type: controller.sort,
                sort_by_field: controller.sortBy,
                filters: controller.filters,
                view: controller.view
            })

            if (mounted.current) {
                setAttributes(() => ({
                    isLoading: false,
                    data: result.data.data,
                    paginationMeta: result.data.meta
                }));
            }
        } catch (err) {
            console.error(err);

            if (mounted.current) {
                setAttributes(() => ({
                    isLoading: false,
                    error: err.message
                }));
            }
        }
    }, [controller]);

    useEffect(() => {
        getAttributes().catch(console.error);
    }, [controller]);

    return (
        <>
            <h1>Product Attributes</h1>
            <div>{JSON.stringify(attributes.data)}</div>
        </>
    )
}

export default ProductAttributes