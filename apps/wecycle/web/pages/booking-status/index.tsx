import { Segmented } from "antd";
import { withPrivatePage } from "../../HOC";
import { useEffect, useState } from "react";
import { useHttp } from "../../hook/useHttp";
import { get_my_bookings } from "@tanbel/homezz/http-client";
import { BookingStatus } from "@tanbel/homezz/types";
import {
  ServiceStatusCard,
  SkeletonServiceStatusCard,
} from "../../components/shared/ServiceStatusCard";

const limit = 10;

function BookingStatusPage() {
  const [tab, setTab] = useState(0);

  const [data, setData] = useState<{ [key: number]: any[] }>({
    0: [],
    1: [],
    2: [],
  });

  const [skip, setSkip] = useState<{ [key: number]: number }>({
    0: 0,
    1: 0,
    2: 0,
  });

  const [hasMore, setHasMore] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
    2: true,
  });

  const { loading, request } = useHttp(() => {
    return get_my_bookings({
      skip: skip[tab],
      limit,
      tab: Object.keys(BookingStatus)[tab],
    });
  });

  const refresh = () => {
    setHasMore((prevHasMore) => {
      return {
        ...prevHasMore,
        [tab]: true,
      };
    });
    setData((prevData) => {
      return {
        ...prevData,
        [tab]: [],
      };
    });
    setSkip((prevSkip) => {
      return {
        ...prevSkip,
        [tab]: 0,
      };
    });
  };

  const fetchData = () => {
    if (hasMore[tab] === false) {
      return;
    }
    request().then((data) => {
      setData((prevData) => {
        return {
          ...prevData,
          [tab]: [...prevData[tab], ...data],
        };
      });
      if (data.length < limit) {
        setHasMore((prevHasMore) => {
          return {
            ...prevHasMore,
            [tab]: false,
          };
        });
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [tab, skip]);

  const handleEndReached = () => {
    setSkip((prevSkip) => {
      return {
        ...prevSkip,
        [tab]: prevSkip[tab] + limit,
      };
    });
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col px-2 pt-2">
      <Segmented
        block
        size="large"
        options={[
          { value: 0, label: "Pending" },
          { value: 1, label: "Approved" },
          { value: 2, label: "Rejected" },
        ]}
        onChange={(value) => {
          setTab(value);
        }}
      />
      <ul className="mt-6 flex flex-col gap-2 list-none">
        {loading
          ? Array.from(Array(10).keys()).map((_, k) => (
              <li key={k}>
                <SkeletonServiceStatusCard />
              </li>
            ))
          : data[tab].map((booking) => {
              return (
                <li key={booking._id}>
                  <ServiceStatusCard serviceData={booking} />
                </li>
              );
            })}
        {!loading && data[tab].length === 0 && (
          <li className="text-center text-gray-500">No data found</li>
        )}
      </ul>
    </div>
  );
}

export default withPrivatePage(BookingStatusPage);
