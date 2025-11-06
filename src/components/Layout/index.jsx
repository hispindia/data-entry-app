import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import styles from "../../components/App/App.module.css";

import antdThemeConfig from "@/antdTheme";
import HeaderBar from "@/components/HeaderBar/HeaderBar.component";
import { useIsPwa } from "@/hooks";
import muiTheme from "@/muiTheme";
import { ConfigProvider } from "antd";
const { app, headerBarContainer } = styles;

const Layout = ({ children }) => {
  const isPwa = useIsPwa();
  // useDisableSwipeDownRefresh();
debugger;
  return (
    <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={muiTheme}>
          <ConfigProvider theme={antdThemeConfig}>
            <div className={app}>
              {!isPwa && (
                <div className={headerBarContainer}>
                  <HeaderBar title="Case Registry App" />
                </div>
              )}
              {children}
            </div>
          </ConfigProvider>
        </ThemeProvider>
    </SnackbarProvider>
  );
};

export default Layout;
