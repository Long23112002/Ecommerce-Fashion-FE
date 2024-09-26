import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Popover, Spin} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import {fetchAllPermission} from "../../api/PermissionApi.ts";

interface Permission {
    id: number;
    name: string;
}

interface PermissionsCheckboxProps {
    permissions: Permission[];
    selectedPermissions: number[];
    onChange: (selected: number[]) => void;
}

const PermissionsCheckbox: React.FC<PermissionsCheckboxProps> = ({permissions, selectedPermissions, onChange}) => {
    const [visiblePermissions, setVisiblePermissions] = useState<Permission[]>(permissions);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    const fetchMorePermissions = async () => {
        if (loading) return;

        setLoading(true);
        try {
            const params = {
                page: page,
                size: 5,
            };
            const response = await fetchAllPermission(params);

            if (Array.isArray(response)) {
                if (response.length < 5) setHasMore(false);
                setVisiblePermissions(prev => [...prev, ...response]);
                setPage(prev => prev + 1);
            } else {
                console.error("Unexpected response format:", response);
            }
        } catch (error) {
            console.error("Error fetching permissions:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setVisiblePermissions(permissions);
    }, [permissions]);

    const handleCheckboxChange = (checkedValues: number[]) => {
        onChange(checkedValues);
    };

    const content = (
        <div id="scrollable-list" style={{maxWidth: 300, maxHeight: 300, overflowY: 'auto'}}>
            <InfiniteScroll
                dataLength={visiblePermissions.length}
                next={fetchMorePermissions}
                hasMore={hasMore}
                loader={loading && <Spin/>}
                endMessage={<p style={{textAlign: 'center'}}>No more permissions</p>}
                scrollableTarget="scrollable-list"
            >
                <Checkbox.Group
                    style={{width: '25%'}}
                    options={visiblePermissions.map(permission => ({
                        label: permission.name,
                        value: permission.id
                    }))}
                    onChange={handleCheckboxChange}
                    value={selectedPermissions}
                />
            </InfiniteScroll>
        </div>
    );

    return (
        <Popover content={content} title="Danh sách quyền" trigger="click" placement="bottomLeft">
            <Button>{selectedPermissions.length ? 'Chỉnh sửa quyền' : 'Chọn quyền'}</Button>
        </Popover>
    );
};

export default PermissionsCheckbox;
