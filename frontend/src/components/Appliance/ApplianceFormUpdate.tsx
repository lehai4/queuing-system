import { getDatabase, ref, update } from "firebase/database";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import {
  Button,
  Header,
  Helmet,
  Input,
  Navbar,
  Selected,
  User,
  Wrapper,
} from "..";
import app from "../../database/firebaseConfig";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addHistorySession } from "../../redux/historySlice";
import { ApplianceProp } from "../../typeProps";
import { formatTimeStamp_version2 } from "../../utils/formatTimeStamp_version2";

type PropsApplianceFormUpdate = {
  getProductBySlug: (value: string) => ApplianceProp | undefined;
};
const ApplianceFormUpdate = (props: PropsApplianceFormUpdate) => {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state?.auth?.login?.currentUser?.user);
  const data = props.getProductBySlug(slug ?? "");
  const appliance = useAppSelector(
    (state) => state.appliances.appliance.applianceArr
  );
  const [applianceOriginal, setApplianceOriginal] = useState<ApplianceProp[]>(
    []
  );
  const navigate = useNavigate();
  let initData: ApplianceProp = {
    id: 0,
    uId: "",
    nameAppliance: "",
    addressIP: "",
    statusActive: "Hoạt động",
    statusConnect: "Kết nối",
    typeAppliance: "",
    nameSignIn: "",
    passSignIn: "",
    useService: "",
  };
  let initialValues = { ...initData, ...data };
  const handleUpdateDb = (data: ApplianceProp) => {
    const db = getDatabase(app);
    // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates: any = {};
    updates["/appliance/" + data.id] = data;

    return update(ref(db), updates);
  };
  const handleCompared = (data1: ApplianceProp, data2: ApplianceProp) => {
    if (
      data1.id === data2?.id &&
      data1.uId === data2?.uId &&
      data1.nameAppliance === data2?.nameAppliance &&
      data1.addressIP === data2?.addressIP &&
      data1.statusConnect === data2?.statusConnect &&
      data1.statusActive === data2?.statusActive &&
      data1.typeAppliance === data2?.typeAppliance &&
      data1.nameSignIn === data2?.nameSignIn &&
      data1.passSignIn === data2?.passSignIn &&
      data1.useService === data2?.useService
    ) {
      return true;
    } else {
      return false;
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      uId: Yup.string().required("required"),
      nameAppliance: Yup.string().required("required"),
      addressIP: Yup.string().required("required"),
      useService: Yup.string().required("required"),
      typeAppliance: Yup.string().required("required"),
      nameSignIn: Yup.string().required("required"),
      passSignIn: Yup.string().required("required"),
    }),
    onSubmit: (e) => {
      const object = {
        user: user?.username,
        timestamp: formatTimeStamp_version2(new Date()),
        Ip: "192.168.1.1",
        action: `Cập nhật thông tin thiết bị ${e.uId}`,
      };
      if (handleCompared(e, initialValues)) {
        toast.error("data has not changed!");
      } else {
        handleUpdateDb(e);
        dispatch(addHistorySession(object));
        toast.success("update successfully!");
        navigate("/thiet-bi");
      }
    },
  });
  const handleCancel = () => {
    navigate(-1);
  };
  useEffect(() => {
    setApplianceOriginal(appliance);
  }, [appliance]);
  return (
    <form
      className="md:mb-0 md:ml-0 mt-24 md:pb-6 md:pt-4 md:pl-6 bg-main-grey rounded-3xl"
      onSubmit={formik.handleSubmit}
    >
      <Wrapper className="absolute md:static md:mb-7 dark:bg-main-dark-bg navbar">
        <Navbar
          title="Thiết bị"
          direct={true}
          path="thiet-bi"
          slug={slug}
          redirect={true}
          showDirection="Danh sách thiết bị"
          showRedirection="Cập nhật thiết bị"
        />
      </Wrapper>
      <Helmet title="Cập nhật thiết bị">
        <Header
          title="Quản lý thiết bị"
          style={{
            fontWeight: 600,
            fontSize: 24,
            color: "#FF7506",
            lineHeight: "110%",
          }}
        />
        <Wrapper className="absolute top-1 right-11">
          <User isLayoutChange={true} />
        </Wrapper>
        <Wrapper className="md:m-14 md:mb-0 md:ml-0 mt-24 p-2 md:p-8 md:pb-12 md:pt-4 md:pl-6 bg-white rounded-3xl">
          <Wrapper className="form-appliance">
            <Header
              title="Thông tin thiết bị"
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: "#FF7506",
                lineHeight: "110%",
              }}
            />
            <Wrapper className="grid grid-cols-2 gap-4">
              <Wrapper className="col-span-1">
                <Wrapper className="form__group form-add-appliance flex flex-col">
                  <Wrapper className="flex items-center">
                    <label htmlFor="">Mã thiết bị:</label>
                    <span className="star ml-1">*</span>
                  </Wrapper>
                  <Input
                    typeInput="text"
                    id="uId"
                    name="uId"
                    placeholder="Nhập mã thiết bị"
                    className="mt-2 mb-3"
                    width={745}
                    value={formik.values.uId}
                    handleChange={formik.handleChange}
                  />
                  {formik.errors.uId && (
                    <p className="mes__error">{formik.errors.uId}</p>
                  )}
                </Wrapper>
                <Wrapper className="form__group form-add-appliance flex flex-col">
                  <Wrapper className="flex items-center">
                    <label htmlFor="">Tên thiết bị:</label>
                    <span className="star ml-1">*</span>
                  </Wrapper>
                  <Input
                    typeInput="text"
                    id="nameAppliance"
                    name="nameAppliance"
                    placeholder="Nhập tên thiết bị"
                    className="mt-2 mb-3"
                    width={745}
                    value={formik.values.nameAppliance}
                    handleChange={formik.handleChange}
                  />
                  {formik.errors.nameAppliance && (
                    <p className="mes__error">{formik.errors.nameAppliance}</p>
                  )}
                </Wrapper>
                <Wrapper className="form__group form-add-appliance flex flex-col">
                  <Wrapper className="flex items-center">
                    <label htmlFor="">Địa chỉ IP:</label>
                    <span className="star ml-1">*</span>
                  </Wrapper>
                  <Input
                    typeInput="text"
                    id="addressIP"
                    name="addressIP"
                    placeholder="Nhập địa chỉ IP"
                    className="mt-2 mb-3"
                    width={745}
                    value={formik.values.addressIP}
                    handleChange={formik.handleChange}
                  />
                  {formik.errors.addressIP && (
                    <p className="mes__error">{formik.errors.addressIP}</p>
                  )}
                </Wrapper>
              </Wrapper>
              <Wrapper className="col-span-1">
                <Wrapper className="form__group form-add-appliance flex flex-col">
                  <Wrapper className="flex items-center">
                    <label htmlFor="">Loại thiết bị:</label>
                    <span className="star ml-1">*</span>
                  </Wrapper>
                  <Selected
                    name="typeAppliance"
                    multi={false}
                    placeholder="Chọn loại thiết bị"
                    handleChange={formik.handleChange}
                    value={formik.values.typeAppliance}
                    options={applianceOriginal
                      .map((ac) => {
                        return ac.typeAppliance;
                      })
                      .filter((act, i, arrCurr) => {
                        return arrCurr.indexOf(act) === i;
                      })
                      .map((item) => {
                        return {
                          label: item,
                          value: item,
                        };
                      })}
                  />
                  {formik.errors.typeAppliance && (
                    <p className="mes__error">{formik.errors.typeAppliance}</p>
                  )}
                </Wrapper>
                <Wrapper className="form__group form-add-appliance flex flex-col">
                  <Wrapper className="flex items-center">
                    <label htmlFor="">Tên đăng nhập:</label>
                    <span className="star ml-1">*</span>
                  </Wrapper>
                  <Input
                    typeInput="text"
                    id="nameSignIn"
                    name="nameSignIn"
                    placeholder="Nhập tài khoản"
                    className="mt-2 mb-3"
                    width={745}
                    value={formik.values.nameSignIn}
                    handleChange={formik.handleChange}
                  />
                  {formik.errors.nameSignIn && (
                    <p className="mes__error">{formik.errors.nameSignIn}</p>
                  )}
                </Wrapper>
                <Wrapper className="form__group form-add-appliance flex flex-col">
                  <Wrapper className="flex items-center">
                    <label htmlFor="">Mật khẩu:</label>
                    <span className="star ml-1">*</span>
                  </Wrapper>
                  <Input
                    typeInput="password"
                    id="passSignIn"
                    name="passSignIn"
                    placeholder="Nhập mật khẩu"
                    className="mt-2 mb-3"
                    width={745}
                    value={formik.values.passSignIn}
                    handleChange={formik.handleChange}
                  />
                  {formik.errors.passSignIn && (
                    <p className="mes__error">{formik.errors.passSignIn}</p>
                  )}
                </Wrapper>
              </Wrapper>
            </Wrapper>
            <Wrapper className="form__group form-add-appliance flex flex-col">
              <Wrapper className="flex items-center">
                <label htmlFor="">Dịch vụ sử dụng:</label>
                <span className="star ml-1">*</span>
              </Wrapper>
              <Selected
                placeholder=""
                multi={true}
                options={initialValues.useService?.split(", ").map((item) => {
                  return {
                    label: item,
                    value: item,
                  };
                })}
                name="useService"
                value={formik.values.useService}
                handleChange={formik.handleChange}
              />
              {formik.errors.useService && (
                <p className="mes__error">{formik.errors.useService}</p>
              )}
            </Wrapper>
            <Wrapper className="form__group form-add-appliance">
              <Wrapper className="flex items-center">
                <span className="star mr-1">*</span>
                <label>Là trường thông tin bắt buộc</label>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </Wrapper>
        <Wrapper className="flex items-center gap-8 justify-center md:mt-7 md:mr-14 md:pr-8">
          <Button
            text="Hủy bỏ"
            bgHoverColor=""
            style={{
              fontSize: 16,
              color: "#FF9138",
              backgroundColor: "#FFF2E7",
              padding: "13px 30px",
              fontWeight: 700,
              maxWidth: 116,
              border: "1px solid #FF9138",
              borderRadius: 8,
            }}
            icon=""
            handleClick={handleCancel}
          />
          <Button
            text="Cập nhật"
            bgHoverColor=""
            style={{
              fontSize: 16,
              color: "#FFFFFF",
              backgroundColor: "#FF9138",
              padding: "13px 22px",
              fontWeight: 700,
              border: "1px solid #FF9138",
              borderRadius: 8,
              maxWidth: 115,
            }}
            icon=""
            handleClick={() => {}}
          />
        </Wrapper>
      </Helmet>
    </form>
  );
};

export default ApplianceFormUpdate;
