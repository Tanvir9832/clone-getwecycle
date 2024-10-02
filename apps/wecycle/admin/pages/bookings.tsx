import DashboardLayout from "../layout/dashbaord";
import {
  BookingStatus,
  BookingType,
  GetProviderBookingsDTO,
  IBooking,
  IBookingModel,
  IUserModel,
} from "@tanbel/homezz/types";
import { useEffect, useRef, useState } from "react";
import { useHttp } from "../hook/useHttp";
import {
  assign_service,
  get_bookings,
  get_providers,
  update_booking_status,
} from "@tanbel/homezz/http-client";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Modal,
  Table,
  Tag,
  List,
  Card,
} from "@tanbel/react-ui";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { formatDate, snackToNormalText, toNormalText } from "@tanbel/utils";
import { theme } from "@tanbel/homezz/utils";
import { Drawer, Image } from "antd";

interface Columns {
  id: string;
  service?: string;
  user?: string;
  status: string;
  location?: string;
  type: IBooking["date"];
  images?: string[];
  date: string;
  priceInputs?: IBooking["priceInputs"];
}

export function Index() {
  const [dataSource, setDataSource] = useState<Columns[]>([]);
  const [bookingsId, setBookingsId] = useState<string>();
  const [singleData, setSingleData] = useState<Columns>();
  const [filterStatus, setFilterStatus] = useState<string>();
  const bookData = useRef<{
    id: string;
    status: BookingStatus;
  }>({
    id: "",
    status: BookingStatus.PENDING,
  });
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedBooking, setSelectedBooking] = useState("");

  const columns = [
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      render: (title: string) => <p>{truncateText(title, 20)}</p>,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Request type",
      dataIndex: "type",
      key: "type",
      render: (date: IBookingModel["date"]) => {
        if (date.mode === BookingType.ONE_TIME) {
          return <Tag color="blue">ONE TIME</Tag>;
        } else if (date.mode === BookingType.BI_WEEKLY) {
          return <Tag color="green">BI_WEEKLY</Tag>;
        } else if (date.mode === BookingType.WEEKLY) {
          return <Tag color="orange">WEEKLY</Tag>;
        } else if (date.mode === BookingType.MONTHLY) {
          return <Tag color="red">MONTHLY</Tag>;
        } else {
          return <Tag>Unknown</Tag>;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data: IBookingModel["status"]) => {
        if (data === BookingStatus.PENDING) {
          return <Tag color="orange">Pending</Tag>;
        } else if (data === BookingStatus.ACCEPTED) {
          return <Tag color="blue">Active</Tag>;
        } else if (data === BookingStatus.REJECTED) {
          return <Tag color="red">Rejected</Tag>;
        } else if (data === BookingStatus.COMPLETED) {
          return <Tag color="green">Completed</Tag>;
        } else {
          return <Tag>Unknown</Tag>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "x",
      render: (id: string, data: any) => {
        return (
          <div className="flex gap-2">
            <Button onClick={() => setSelectedBooking(id)} size="small">
              Assign
            </Button>
            <Dropdown
              items={[BookingStatus.ACCEPTED, BookingStatus.REJECTED]
                .filter((a) => a !== data.status)
                .map((status) => ({
                  label: toNormalText(status),
                  onClick: () => updateBookingStatus(id, status),
                }))}
            >
              Status
            </Dropdown>
            <Button onClick={() => handleShowBooking(id)} size="small">
              View
            </Button>
          </div>
        );
      },
    },
  ];
  const updateBookingStatus = (id: string, status: BookingStatus) => {
    bookData.current.id = id;
    bookData.current.status = status;
    requestStatusUpdate().then((res) => {
      if (res) {
        setDataSource((prev) => {
          return prev.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                status: status,
              };
            }
            return item;
          });
        });
      }
    });
  };

  const { request: requestBooking, loading: loadingBooking } = useHttp<
    GetProviderBookingsDTO[]
  >(() => {
    return get_bookings({ tab: filterStatus });
  });

  const { request: requestAssign, loading: loadingAssign } = useHttp<string>(
    () => {
      return assign_service({
        bookingId: selectedBooking,
        providerId: selectedProvider,
      });
    }
  );

  const { request: requestStatusUpdate, loading: loadingStatusUpdate } =
    useHttp<GetProviderBookingsDTO>(() => {
      return update_booking_status(
        bookData.current.id,
        bookData.current.status
      );
    });

  const {
    data: providers,
    request: getProviders,
    loading: loadingProvider,
  } = useHttp<IUserModel[]>(() => {
    return get_providers();
  });

  // useEffect(() => {
  //   getProviders();
  //   requestBooking().then((data) => {
  //     if (data) {
  //       setDataSource(
  //         data.map((item) => ({
  //           id: item._id,
  //           user: item.user.username,
  //           service: item.service.title,
  //           status: item.status,
  //           location: item.location.name,
  //           date: formatDate(item.date.start, 'dd-MM-yy hh:mm a'),
  //           type: item.date,
  //         }))
  //       );
  //     }
  //   });
  // }, []);

  useEffect(() => {
    getProviders();
    requestBooking().then((data) => {
      if (data) {
        let filteredData: Columns[] = data.map((item) => ({
          id: item._id,
          user: item.user.username,
          service: item.service.title,
          status: item.status,
          images: item.images,
          location: item?.location?.name,
          date: formatDate(item.date.start, "dd-MM-yy hh:mm a"),
          type: item.date,
          priceInputs: item.priceInputs?.map((pInput) => {
            return {
              label:
                item.service.priceInputs?.find((p) => p.name === pInput.name)
                  ?.label || pInput.name,
              value: pInput.value,
              name: pInput.name,
            };
          }),
        }));
        setDataSource(filteredData);
      }
    });
  }, [filterStatus]);

  const isSelected = (id: string) => {
    return selectedProvider === id;
  };

  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }

  const handleShowBooking = (id: string) => {
    setBookingsId(id);
    const singleData = dataSource.find((item) => item.id === id);
    setSingleData(singleData);
  };

  const confirmAssign = () => {
    setSelectedBooking("");
    setSelectedProvider("");
    requestAssign().then((res) => {
      if (res) {
        setDataSource((prev) => {
          return prev.filter((item) => item.id !== selectedBooking);
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <Modal
        title="Assign provider"
        open={!!selectedBooking}
        onCancel={() => setSelectedBooking("")}
        onOk={confirmAssign}
      >
        <div className="flex flex-col gap-2 mt-2">
          <Input className="w-full" placeholder="Search provider" />
          <List
            style={{}}
            loading={loadingProvider}
            dataSource={providers || []}
            renderItem={(item) => (
              <List.Item
                style={{
                  backgroundColor: isSelected(item._id) ? theme.secondary : "",
                  cursor: "pointer",
                  margin: "0 -24px",
                  padding: "10px 24px",
                }}
                onClick={() => {
                  setSelectedProvider(item._id);
                }}
                key={item._id}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.username}
                  description={item.email}
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>
      <Drawer
        title="View Request "
        open={!!bookingsId}
        onClose={() => setBookingsId("")}
        width={1000}
      >
        <div className="flex flex-col gap-2 mt-2">
          <Card className="p-2 w-full max-w-4xl mx-auto">
            <Swiper
              pagination={{
                type: "progressbar",
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className="mySwiper"
            >
              {singleData?.images?.map((image: string) => (
                <SwiperSlide>
                  <Image
                    height="300px"
                    width="100%"
                    style={{ objectFit: "cover" }}
                    src={image}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <h3 className="my-2 p-2 text-2xl font-bold">
              {singleData?.service}
            </h3>
            <Table
              className="my-2"
              dataSource={[
                {
                  key: "1",
                  label: "User",
                  value: singleData?.user,
                },
                {
                  key: "2",
                  label: "Location",
                  value: singleData?.location,
                },
                {
                  key: "3",
                  label: "Status",
                  value: <Tag color="orange">{singleData?.status}</Tag>,
                },
                {
                  key: "4",
                  label: "Type",
                  value: <Tag color="blue">{singleData?.type?.mode}</Tag>,
                },
              ]}
              columns={[
                {
                  title: "Title",
                  dataIndex: "label",
                  key: "label",
                },
                {
                  title: "Info",
                  dataIndex: "value",
                  key: "value",
                },
              ]}
              pagination={false}
            />
            {singleData?.priceInputs && (
              <div>
                <h3 className="my-2">Price Inputs: </h3>
                <Table
                  className="my-1"
                  dataSource={singleData.priceInputs}
                  columns={[
                    {
                      title: "Label",
                      dataIndex: "label",
                      key: "label",
                    },
                    {
                      title: "User Input",
                      dataIndex: "value",
                      key: "value",
                    },
                  ]}
                  pagination={false}
                  rowKey="name"
                />
              </div>
            )}
          </Card>
        </div>
      </Drawer>
      <div className="text-end mb-5">
        <Dropdown
          items={[
            "",
            BookingStatus.PENDING,
            BookingStatus.ACCEPTED,
            BookingStatus.COMPLETED,
          ].map((status) => ({
            label: status ? snackToNormalText(status) : "All",
            onClick: () => setFilterStatus(status),
          }))}
        >
          Filter by Status
        </Dropdown>
      </div>
      <Table
        loading={loadingBooking || loadingStatusUpdate || loadingAssign}
        className="overflow-auto"
        dataSource={dataSource}
        columns={columns}
      />
    </DashboardLayout>
  );
}

export default Index;
