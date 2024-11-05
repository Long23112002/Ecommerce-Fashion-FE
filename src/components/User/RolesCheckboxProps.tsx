import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Popover, Spin} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import {fetchAllRole} from "../../api/RoleApi";
import {assignRoleToUser} from "../../api/UserApi";
import {debounce} from 'lodash';
import {toast} from "react-toastify";
import {getErrorMessage} from "../../pages/Error/getErrorMessage.ts";

interface Role {
    id: number;
    name: string;
    description: string;
}

interface RolesCheckboxProps {
    userId: number;
    email: string;
    selectedRoles: number[];
    onChange: (selected: number[]) => void;
}

const RolesCheckbox: React.FC<RolesCheckboxProps> = ({email, selectedRoles, onChange}) => {
    const [visibleRoles, setVisibleRoles] = useState<Role[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    const fetchMoreRoles = debounce(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetchAllRole('', 5, page);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const {data: roles, total} = response;
            if (roles.length < 5 || visibleRoles.length + roles.length >= total) setHasMore(false);
            const newRoles = roles.filter((role: { id: number; }) => !visibleRoles.some(vRole => vRole.id === role.id));
            setVisibleRoles(prev => {
                const combined = [...prev, ...newRoles];
                return Array.from(new Map(combined.map(role => [role.id, role])).values());
            });
            setPage(prev => prev + 1);
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    }, 300);

    useEffect(() => {
        fetchMoreRoles();
    }, []);

    const handleCheckboxChange = async (checkedValues: number[]) => {
        try {
            await assignRoleToUser({email, roleIds: checkedValues});
            onChange(checkedValues);
        } catch (error) {
            toast.error(getErrorMessage(error));
        }
    };

    const content = (
        <div id="scrollable-list" style={{maxWidth: '160px', maxHeight: 300, overflowY: 'auto'}}>
            <InfiniteScroll
                dataLength={visibleRoles.length}
                next={fetchMoreRoles}
                hasMore={hasMore}
                loader={loading && <Spin/>}
                scrollableTarget="scrollable-list"
            >
                <div className="row">
                    <Checkbox.Group
                        className="col-12"
                        style={{width: '100%'}}
                        options={visibleRoles.map(role => ({
                            label: role.description,
                            value: role.id
                        }))}
                        onChange={handleCheckboxChange}
                        value={selectedRoles}
                    />
                </div>

            </InfiniteScroll>
        </div>
    );

    return (
        <Popover content={content} title="Danh sách vai trò" trigger="click" placement="bottomLeft">
            <Button>{selectedRoles.length ? 'Chỉnh sửa vai trò' : 'Chọn vai trò'}</Button>
        </Popover>
    );
};

export default RolesCheckbox;
