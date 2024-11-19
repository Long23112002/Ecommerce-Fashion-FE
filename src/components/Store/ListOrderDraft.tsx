import { Button, Col, Divider, FormInstance, Row } from "antd"
import Order from "../../types/Order";

const style: React.CSSProperties = {
    background: '#f1fa6e',
    padding: '15px 50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
};

interface ListOrderDraftProps {
    orderPendingList: Order[];
    handleOrder: (order: Order) => void;
}

const ListOrderDraft: React.FC<ListOrderDraftProps> = ({
    orderPendingList,
    handleOrder
}) => {

    return (
        <div >
            <Divider orientation="left">Danh sách hóa đơn chờ</Divider>
            {orderPendingList.length > 0 ?
                (
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        {orderPendingList.map((order, index) => (
                            <Col key={index} className="gutter-row" span={6}>
                                <Button
                                    style={style}
                                    onClick={() => handleOrder(order)}
                                >
                                    {order.code}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                )
                :
                (
                    <p>Không có hóa đơn chờ nào!</p>
                )}
        </div>
    )
}

export default ListOrderDraft