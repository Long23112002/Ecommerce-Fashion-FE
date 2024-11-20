import React, { useEffect, useState } from "react"
import { Alert, Button, Card, Col, Row, Typography } from "antd"
import { ArrowLeftOutlined } from '@ant-design/icons'
import {useLocation, useNavigate} from "react-router-dom";
import {checkSumPayment, payOrder} from "../../../api/OrderApi";
import {toast} from "react-toastify";
import useCart from "../../../hook/useCart";


const { Title, Text } = Typography

 const  PaymentQRComponent =()=>  {
    const [minutes, setMinutes] = useState(14)
    const [seconds, setSeconds] = useState(59)
    const navigate = useNavigate();
    const location = useLocation();
    const [checkSum , setCheckSum] = useState(false)
    const { order, orderRequest } = location.state || {}
     const {reload} = useCart();



     const bankImageUrl = [
        {
            id :1,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/vib.svg"
        },
        {
            id :2,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/tpbank.svg"
        },
        {
            id :3,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/coopbank.svg"
        },
        {
            id :4,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/acb.svg"
        },
        {
            id :5,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/vbsp.svg"
        }
        ,
        {
            id :6,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/vidbank.svg"
        },
        {
            id :7,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/techcombank.svg"
        },
        {
            id :8,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/vcbpay.svg"
        },
        {
            id :9,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/agribank.svg"
        },
        {
            id :10,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/viettelpay.svg"
        },
        {
            id :11,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/ojb.svg"
        },
        {
            id :12,
            url:"https://sandbox.vnpayment.vn/paymentv2/images/img/logos/bank/big/vietinbank.svg"
        }
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1)
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timer)
                    handelCancelPayment();
                } else {
                    setMinutes(minutes - 1)
                    setSeconds(59)
                }
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [minutes, seconds])

     const handelCancelPayment = () => {
         toast.success("Giao dịch đã bị hủy")
         navigate("/")
     }

     useEffect(() => {
         const checkPaymentStatus = async () => {
             const result = await checkSumPayment(order?.finalPrice, `DH${order?.id}`);
             if (result === true) {
                 await payOrder(orderRequest);
                 toast.success("Đã thanh toán thành công");
                 reload()
                 setCheckSum(true);
                 clearInterval(intervalId);
             }
         };

         const intervalId = setInterval(checkPaymentStatus, 5000);

         return () => clearInterval(intervalId);
     }, [order, navigate]);



    const handelBack = () => {
        navigate('/checkout')
    }

    const formatNumber = (num:any) => num?.toString().padStart(2, '0');

    const formatPrice = (price:any) => price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");


    return (
        <>

            <div style={{maxWidth: '1024px', margin: '0 auto', padding: '16px'}}>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                }}>
                    <Button onClick={handelBack} type="text" icon={<ArrowLeftOutlined/>}>
                        Quay lại
                    </Button>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <Text>Giao dịch hết hạn sau</Text>
                        <Text style={{
                            background: '#1f2937',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px'
                        }}>{formatNumber(minutes)}</Text>
                        <Text style={{
                            background: '#1f2937',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px'
                        }}>{formatNumber(seconds)}</Text>
                    </div>
                </div>

                <Card style={{marginBottom: '16px'}}>
                    {checkSum ? (
                        <div style={{display: 'flex', justifyContent: 'end'}}>
                            <div className="btn mb-3" style={{
                                color: "#198754",
                                borderColor: '#198754'
                            }}>
                                Đã thanh toán
                            </div>
                        </div>
                    ) : (
                        <div style={{display: 'flex', justifyContent: 'end'}}>
                            <div className="btn mb-3" style={{
                                color: "#dc3545",
                                borderColor: '#dc3545'
                            }}>
                                Chưa thanh toán
                            </div>
                        </div>
                    )}
                    <Alert
                        message="Quý khách vui lòng không tắt trình duyệt cho đến khi nhận được kết quả giao dịch trên website. Trường hợp đã thanh toán nhưng chưa nhận kết quả giao dịch, vui lòng bấm 'Tải lại' để phản hồi kết quả. Xin cảm ơn!"
                        type="warning"
                        style={{marginBottom: '16px'}}
                />

                <Row
                    gutter={24}
                    style={{
                        display: 'flex',
                        alignItems: 'stretch',
                    }}
                >
                    <Col span={12}>
                        <Card
                            title="Thông tin đơn hàng"
                            style={{height: '100%'}}
                        >
                            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                                <div>
                                    <Text type="secondary">Số tiền thanh toán</Text>
                                    <Title level={4}>{formatPrice(order?.finalPrice)} VND</Title>
                                </div>
                                <div>
                                    <Text type="secondary">Tên ngân hàng</Text>
                                    <div>Ngân hàng TMCP Quân đội MB</div>
                                </div>
                                <div>
                                    <Text type="secondary">Chủ tài khoản</Text>
                                    <div>Nguyễn Phương Nam</div>
                                </div>
                                <div>
                                    <Text type="secondary">Số tài khoản</Text>
                                    <div>2222013333567</div>
                                </div>
                                <div>
                                    <Text type="secondary">Nội dung chuyển tiền</Text>
                                    <div>{`DH${order?.id}`}</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title="Quét mã qua ứng dụng Ngân hàng/Ví điện tử"
                            style={{height: '100%'}}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    position: 'relative',
                                }}
                            >
                                <img
                                    src="https://demo.omfarm.com.vn/assets/images/frame_qr.png"
                                    alt="Frame"
                                    style={{
                                        width: '350px',
                                        height: '350px',
                                    }}
                                />
                                <img
                                    src={`https://img.vietqr.io/image/mb-2222013333567-compact2.jpg?amount=${order?.finalPrice}&addInfo=DH${order?.id}&accountName=Nguyễn Phương Nam`}
                                    alt="QR Code"
                                    style={{
                                        width: '300px',
                                        height: '300px',
                                        position: 'absolute',
                                        top: '31px',
                                        zIndex: 1,
                                        borderRadius: '10px'
                                    }}
                                />
                                {checkSum ? (
                                    <Button onClick={() => navigate('/')} className="mt-3 btn btn-outline-success" >
                                       <div style={{margin:'-4px'}}>
                                               Về trang chủ
                                       </div>
                                    </Button>
                                ) : (
                                    <Button onClick={handelCancelPayment} className="mt-3" danger>
                                        Hủy thanh toán
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </Col>
                </Row>

            </Card>

                <Card title="Danh sách Ngân hàng/Ví điện tử có áp dụng khuyến mãi">
                <Row gutter={[16, 16]}>
                        {bankImageUrl.map(item => (
                            <Col key={item.id} span={6}>
                                <Card hoverable style={{textAlign: 'center'}}>
                                    <img src={item.url}
                                         style={{width: '120px', height: '40px'}} alt=""/>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </div>
        </>
    )
 }

export default PaymentQRComponent