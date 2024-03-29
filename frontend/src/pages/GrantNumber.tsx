import moment from "moment";
import { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Link } from "react-router-dom";
import plus from "../assets/icon/add-square.png";
import {
  Button,
  DatePickers,
  Header,
  Helmet,
  Input,
  Navbar,
  Selector,
  Wrapper,
} from "../components";
import User from "../components/User";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { paginationComponentOptions, statusGrant } from "../mock/dummy";
import { fetchGrantNumber } from "../redux/grantNumberSlice";
import { GrantNumberInterface } from "../typeProps";
import { formatTimeStamp } from "../utils/formatTimeStamp";

const timesGrant = (data: any) => {
  return <span>{formatTimeStamp(data)}</span>;
};

const Service = () => {
  const dispatch = useAppDispatch();
  const grantNumbers = useAppSelector(
    (state) => state.grantNumbers.grantNumber.grantArr
  );
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [nameService, setNameService] = useState<string>("Tất cả");
  const [sourceProvider, setSourceProvider] = useState<string>("Tất cả");
  const [status, setStatus] = useState<string>("Tất cả");
  const [searchInput, setSearchInput] = useState<string>("");
  const [grantNumber, setGrantNumber] = useState<GrantNumberInterface[]>([]);
  const [grantNumberOriginal, setGrantNumberOriginal] = useState<
    GrantNumberInterface[]
  >([]);
  const columns: TableColumn<GrantNumberInterface>[] = [
    {
      name: "STT",
      selector: (row) => row.stt,
      allowOverflow: false,
      width: "165px",
      center: true,
    },
    {
      name: "Tên khách hàng",
      selector: (row) => row.name,
      allowOverflow: false,
      width: "200px",
    },
    {
      name: "Tên dịch vụ",
      selector: (row) => row.nameService,
      allowOverflow: false,
      width: "200px",
    },
    {
      name: "Thời gian cấp",
      cell: (row) => timesGrant(row.timeGrant),
      allowOverflow: false,
      width: "200px",
    },
    {
      name: "Hạn sử dụng",
      cell: (row) => timesGrant(row.expireUse),
      allowOverflow: false,
      width: "200px",
    },
    {
      name: "Trạng thái",
      cell: (row) => statusGrant(row.status),
      allowOverflow: false,
      width: "220px",
    },
    {
      name: "Nguồn cấp",
      selector: (row) => row.sourceProvider,
      allowOverflow: false,
      width: "220px",
    },
    {
      cell: (row) => (
        <div className="flex align-center">
          <Link
            to={`chi-tiet/${row.stt}`}
            className="btn btn-detail underline capitalize rounded-2xl text-md"
          >
            Chi tiết
          </Link>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      center: false,
      width: "140px",
    },
  ];
  const convertDate = (value: any) => {
    let date = new Date(value);
    return date;
  };
  useEffect(() => {
    let filterResult: GrantNumberInterface[] = grantNumberOriginal;
    filterResult =
      searchInput !== ""
        ? grantNumberOriginal.filter((app) => app.stt == searchInput)
        : filterResult;
    filterResult =
      nameService !== "Tất cả"
        ? filterResult.filter((app) => app.nameService === nameService)
        : filterResult;
    filterResult =
      status !== "Tất cả"
        ? filterResult.filter((app) => {
            let curentValue: string = "";
            if (app.status === 1) {
              curentValue = "Đã sử dụng";
            } else if (app.status === 0) {
              curentValue = "Đang chờ";
            } else if (app.status === -1) {
              curentValue = "Bỏ qua";
            }
            return curentValue == status;
          })
        : filterResult;
    filterResult =
      sourceProvider !== "Tất cả"
        ? filterResult.filter((app) => {
            return app.sourceProvider === sourceProvider;
          })
        : filterResult;
    setGrantNumber(filterResult);
  }, [nameService, status, sourceProvider, searchInput]);

  useEffect(() => {
    setGrantNumber(grantNumbers);
    setGrantNumberOriginal(grantNumbers);
  }, [grantNumbers]);
  useEffect(() => {
    let filterResult: GrantNumberInterface[] = grantNumberOriginal;
    filterResult =
      startDate !== null && endDate !== null
        ? grantNumberOriginal.filter(
            (item) =>
              (moment(convertDate(item.timeGrant), "DD/MM/YYYY").isSameOrAfter(
                moment(startDate)
              ) &&
                moment(endDate).isSameOrAfter(
                  moment(convertDate(item.timeGrant), "DD/MM/YYYY")
                )) ||
              (moment(convertDate(item.expireUse), "DD/MM/YYYY").isSameOrAfter(
                moment(startDate)
              ) &&
                moment(endDate).isSameOrAfter(
                  moment(convertDate(item.expireUse), "DD/MM/YYYY")
                ))
          )
        : filterResult;
    setGrantNumber(filterResult);
  }, [startDate, endDate]);
  useEffect(() => {
    dispatch(fetchGrantNumber());
  }, []);
  return (
    <Wrapper className="md:mb-0 md:ml-0 mt-24 md:pb-6 md:pt-4 md:pl-6 bg-main-grey rounded-3xl">
      <div className="absolute md:static md:mb-7 dark:bg-main-dark-bg navbar">
        <Navbar
          title="Cấp số"
          direct={true}
          redirect={false}
          path="cap-so"
          slug="/"
          showRedirection=""
          showDirection="Danh sách cấp số"
        />
      </div>
      <Helmet title="Thiết bị">
        <Header
          title="Quản lý cấp số"
          style={{
            fontWeight: "700",
            fontSize: 24,
            color: "#FF7506",
            lineHeight: "110%",
          }}
        />
        <Wrapper className="absolute top-1 right-11">
          <User isLayoutChange={true} />
        </Wrapper>
        <Wrapper className="flex flex-row filter-option justify-between md:mr-28 md:mb-4 md:mt-5">
          <Wrapper className="flex flex-row gap-6">
            <Wrapper className="flex flex-col w-48">
              <label className="label-title">Tên dịch vụ</label>
              <Selector
                optionComon="Tất cả"
                isShowCommon={true}
                setValue={setNameService}
                items={grantNumberOriginal.map((act) => act.nameService)}
              />
            </Wrapper>
            <Wrapper className="flex flex-col w-40">
              <label className="label-title">Tình trạng</label>
              <Selector
                optionComon="Tất cả"
                isShowCommon={true}
                setValue={setStatus}
                items={grantNumberOriginal
                  .map((item) => {
                    return item.status === 1
                      ? "Đã sử dụng"
                      : item.status === 0
                      ? "Đang chờ"
                      : item.status === -1
                      ? "Bỏ qua"
                      : [];
                  })
                  .map((item) => item)}
              />
            </Wrapper>
            <Wrapper className="flex flex-col w-40">
              <label className="label-title">Nguồn cấp</label>
              <Selector
                optionComon="Tất cả"
                isShowCommon={true}
                setValue={setSourceProvider}
                items={grantNumberOriginal.map(
                  (connect) => connect.sourceProvider
                )}
              />
            </Wrapper>
          </Wrapper>
          <Wrapper className="flex flex-col">
            <label className="label-title">Chọn thời gian</label>
            <Wrapper className="flex flex-row items-center">
              <DatePickers
                valueStart={startDate}
                valueEnd={endDate}
                showIcon={true}
                isRange={true}
                setValueStart={(preV) => setStartDate(preV)}
                setValueEnd={(preV) => setEndDate(preV)}
              />
            </Wrapper>
          </Wrapper>
          <Wrapper className="flex flex-col filter-option-search">
            <label className="label-title">Từ khóa</label>
            <Input
              placeholder="Nhập từ khóa"
              typeInput="text"
              handleChange={(e) => setSearchInput(e.target.value)}
              width={300}
              className=""
              name=""
              id=""
              value={searchInput}
            />
          </Wrapper>
        </Wrapper>
        <Wrapper className="content flex flex-row gap-7">
          <Wrapper className="content-table">
            <DataTable
              columns={columns}
              data={grantNumber}
              pagination
              responsive
              paginationPerPage={10}
              paginationRowsPerPageOptions={[5, 10, 15, 20]}
              paginationComponentOptions={paginationComponentOptions}
            />
          </Wrapper>
          <Link to="cap-so-moi">
            <Button
              text="Cấp số mới"
              handleClick={() => {}}
              style={{
                backgroundColor: "#FFF2E7",
                height: 94,
                width: 80,
                color: "#FF7506",
                lineHeight: "19px",
                fontSize: 14,
                padding: 8,
                borderRadius: 8,
              }}
              icon={plus}
              bgHoverColor=""
            />
          </Link>
        </Wrapper>
      </Helmet>
    </Wrapper>
  );
};

export default Service;
