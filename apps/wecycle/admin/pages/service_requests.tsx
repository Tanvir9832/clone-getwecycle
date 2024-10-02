import { get_requests, handle_requests } from "@tanbel/homezz/http-client";
import {
  GetProviderServiceDTO,
  ProviderServiceStatus,
  UserType,
} from "@tanbel/homezz/types";
import { Dropdown, Table, Tag, Text } from "@tanbel/react-ui";
import { useEffect, useState } from "react";
import Private from "../components/Private";
import { useHttp } from "../hook/useHttp";
import DashboardLayout from "../layout/dashbaord";

interface Columns {
  service: GetProviderServiceDTO["service"];
  provider: GetProviderServiceDTO["provider"];
  status: string;
  location: string;
  range: number;
}

export function Index() {
  const [dataSource, setDataSource] = useState<Columns[]>([]);

  const { request, loading } = useHttp<GetProviderServiceDTO[]>(() => {
    return get_requests();
  });

  const { customRequest, loading: handleRequestLoader, data } = useHttp();

  const columns = [
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      render: (data: GetProviderServiceDTO["service"]) => (
        <Text>{data.title}</Text>
      ),
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
      render: (data: GetProviderServiceDTO["provider"]) => (
        <Text>{data.username}</Text>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Range (km)",
      dataIndex: "range",
      key: "range",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (data: GetProviderServiceDTO["status"]) => {
        if (data === ProviderServiceStatus.PENDING) {
          return <Tag color="orange">Pending</Tag>;
        } else if (data === ProviderServiceStatus.ACTIVE) {
          return <Tag color="green">Active</Tag>;
        } else if (data === ProviderServiceStatus.REJECTED) {
          return <Tag color="red">Rejected</Tag>;
        } else if (data === ProviderServiceStatus.DEACTIVATED) {
          return <Tag color="gray">Deactivated</Tag>;
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
          <Dropdown
            items={[
              ProviderServiceStatus.ACTIVE,
              ProviderServiceStatus.REJECTED,
            ].map((status) => ({
              label: status,
              onClick: () =>
                updateStatus(data.provider._id, data.service._id, status),
            }))}
          >
            Status
          </Dropdown>
        );
      },
    },
  ];

  useEffect(() => {
    request().then((data) => {
      if (data) {
        setDataSource(
          data.map((item) => ({
            provider: item.provider,
            service: item.service,
            status: item.status,
            location: item.location.name,
            range: item.location.range,
          }))
        );
      }
    });
  }, []);

  const updateStatus = (
    provider: string,
    service: string,
    status: ProviderServiceStatus
  ) => {
    customRequest(() => {
      return handle_requests({
        providerId: provider,
        status,
        serviceId: service,
      });
    }).then(() => {
      setDataSource((prev) => {
        return prev.map((item) => {
          if (item.provider._id === provider && item.service._id === service) {
            return {
              ...item,
              status,
            };
          }
          return item;
        });
      });
    });
  };

  return (
    <DashboardLayout>
      <Table
        loading={loading || handleRequestLoader}
        className="overflow-auto"
        dataSource={dataSource}
        columns={columns}
      />
    </DashboardLayout>
  );
}

const PrivatePage = () => {
  return (
    <Private access={[UserType.SUPER_ADMIN, UserType.ADMIN]}>
      <Index />
    </Private>
  );
};

export default PrivatePage;
