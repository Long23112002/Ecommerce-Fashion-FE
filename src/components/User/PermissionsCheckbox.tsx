import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Collapse, Popover, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchAllPermission } from "../../api/PermissionApi.ts";

interface Permission {
    id: number;
    name: string;
    description: string;
}

export interface PermissionGroup {
    id: number;
    name: string;
    permissions: Permission[];
}

interface PermissionsCheckboxProps {
    permissionGroups: PermissionGroup[];
    selectedPermissions: number[];
    onChange: (selected: number[]) => void;
}

const PermissionsCheckbox: React.FC<PermissionsCheckboxProps> = ({ permissionGroups, selectedPermissions, onChange }) => {
    const [visiblePermissionGroups, setVisiblePermissionGroups] = useState<PermissionGroup[]>(permissionGroups || []);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    const fetchMorePermissions = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const params = { page, size: 2000 };
            const response = await fetchAllPermission(params);

            if (response && response.data && Array.isArray(response.data)) {
                setVisiblePermissionGroups(prev => {
                    const newPermissions = response.data.filter((group: PermissionGroup) =>
                        !prev.some((existingGroup: PermissionGroup) => existingGroup.id === group.id)
                    );
                    return [...prev, ...newPermissions];
                });
                if (response.data.length < 2000) {
                    setHasMore(false);
                } else {
                    setPage(prev => prev + 1);
                }
            }
        } catch (error) {
            console.error("Error fetching permissions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setVisiblePermissionGroups(permissionGroups || []);
    }, [permissionGroups]);

    const handleCheckboxChange = (checkedValues: number[]) => {
        onChange(checkedValues);
    };

    const handleSelectAll = (_groupId: number, permissions: Permission[]) => {
        const allPermissions = permissions.map(permission => permission.id);
        const areAllSelected = allPermissions.every(permissionId => selectedPermissions.includes(permissionId));
        let updatedSelected = [...selectedPermissions];

        if (areAllSelected) {
            updatedSelected = updatedSelected.filter(id => !allPermissions.includes(id));
        } else {
            updatedSelected = [...new Set([...updatedSelected, ...allPermissions])];
        }

        onChange(updatedSelected);
    };
    const isAllSelected = (permissions: Permission[]) => {
        return permissions.every(permission => selectedPermissions.includes(permission.id));
    };

    const content = (
        <div id="scrollable-list" style={{ maxWidth: 300, maxHeight: 300, overflowY: 'auto' }}>
            <InfiniteScroll
                dataLength={visiblePermissionGroups.length}
                next={fetchMorePermissions}
                hasMore={hasMore}
                loader={loading && <Spin />}
                scrollableTarget="scrollable-list"
            >
                <div className="row">
                    {visiblePermissionGroups.map(group => (
                        <Collapse key={group.id} defaultActiveKey={['1']}>
                            <Collapse.Panel className="row" header={group.name} key={group.id}>
                                <Checkbox
                                    style={{ marginBottom: 16 }}
                                    onChange={() => handleSelectAll(group.id, group.permissions)}
                                    checked={isAllSelected(group.permissions)}
                                >
                                    Chọn tất cả
                                </Checkbox>
                                <Checkbox.Group
                                    className="col-12"
                                    style={{ width: '100%', backgroundColor: 'white' }}
                                    options={group.permissions.map(permission => ({
                                        label: permission.description,
                                        value: permission.id
                                    }))}
                                    onChange={handleCheckboxChange}
                                    value={selectedPermissions}
                                />
                            </Collapse.Panel>
                        </Collapse>
                    ))}
                </div>
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
