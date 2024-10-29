import React, { useEffect, useState } from "react";
import type { TableColumnsType, TableProps } from "antd";
import {
  Button,
  Table,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Row,
  Col,
} from "antd";
import { Promotion } from "../../types/Promotion";
import {
  StatusPromotionEnum,
  StatusPromotionLable,
} from "../../enum/StatusPromotionEnum";
import {
  TypePromotionEnum,
  TypePromotionLabel,
} from "../../enum/TypePromotionEnum";
import { useLocation } from "react-router-dom";
import moment from 'moment';
import dayjs from 'dayjs';
import { Container } from "react-bootstrap";

const PromotionScheduled: React.FC = () => {
  const [valueSuffix, setValueSuffix] = useState<string>("");

  const location = useLocation();
  const selectedPromotion= location.state;

  useEffect(() => {
    console.log("Đó là:",selectedPromotion)
    if (selectedPromotion) {
      switch (selectedPromotion.typePromotionEnum) {
        case TypePromotionEnum.PERCENTAGE_DISCOUNT:
          setValueSuffix("%");
          break;
        case TypePromotionEnum.AMOUNT_DISCOUNT:
          setValueSuffix("VNĐ");
          break;
        default:
          setValueSuffix("");
      }
    }
  }, [selectedPromotion]);

  return (
    <Container>
    <Row gutter={16} style={{
      marginTop: "50px",
      marginLeft: "50px",
      marginRight: "50px",
    }}>
      <Col span={16}>
        {/* <Table<DataType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        /> */}
      </Col>

      <Col span={8}>
      <h5>Thông tin đợt giảm giá</h5>
        <Form layout="vertical" initialValues={selectedPromotion} disabled>
          <Form.Item name="typePromotionEnum" label="Kiểu khuyến mãi">
            <Select
              placeholder="Chọn kiểu khuyến mãi"
              value={selectedPromotion?.typePromotionEnum}
            >
              {Object.entries(TypePromotionEnum).map(([key, value]) => (
                <Select.Option key={value} value={value}>
                  {TypePromotionLabel[value]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="value" label="Giá trị">
            <InputNumber
              style={{ width: "100%" }}
              addonAfter={valueSuffix}
              value={selectedPromotion?.value}
            />
          </Form.Item>

          <Form.Item name="startDate" label="Ngày bắt đầu">
            <Input
              style={{ width: "100%" }}
              name="startDate"
              value={
                dayjs(selectedPromotion.startDate)
                  
              }
              
            />
          </Form.Item>

          <Form.Item name="endDate" label="Ngày kết thúc">
            <Input
              style={{ width: "100%" }}
              name="endDate"
              value={
                selectedPromotion.endDate
                  
              }
              
            />
          </Form.Item>

          <Form.Item name="statusPromotionEnum" label="Trạng thái">
            <Select
              placeholder="Chọn trạng thái khuyến mãi"
              value={selectedPromotion?.statusPromotionEnum}
              disabled
            >
              {Object.entries(StatusPromotionEnum).map(([key, value]) => (
                <Select.Option key={value} value={value}>
                  {StatusPromotionLable[value]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
 
        </Form>
      </Col>
    </Row>
    </Container>
  );
};

export default PromotionScheduled;
