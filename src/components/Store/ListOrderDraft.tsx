import { Button, Col, Divider, Row } from "antd"

const style: React.CSSProperties = {
    background: '#f1fa6e',
    padding: '15px 50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
};

const ListOrderDraft = () => {

    return (
        <div >
            <Divider orientation="left">Danh sách hóa đơn chờ</Divider>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                    <Button style={style}>
                        col-6
                    </Button>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Button style={style}>
                        col-6
                    </Button>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Button style={style}>
                        col-6
                    </Button>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Button style={style}>
                        col-6
                    </Button>
                </Col>
            </Row>

        </div>
    )
}

export default ListOrderDraft