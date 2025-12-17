"use client";

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Container, KindleOasis } from "@kindle-ui/core";
import Header from "@/components/Header";
import RelatedLink from "@/components/RelatedLinks";
import { ICurrentPage, ISiteConfig } from "@/types/index";
import { ColorSchemeProvider } from "@/contexts/colorScheme";
import "kindle-fonts/bookerly.css";
import "kindle-fonts/amazon-ember.css";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * a {
	color: inherit;
  }

  body {
    margin: 0;
    overflow-x: hidden;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-family: -apple-system, system-ui, Segoe UI, Roboto, Ubuntu, Cantarell,
      Noto Sans, sans-serif, BlinkMacSystemFont, Helvetica Neue, PingFang SC,
      Hiragino Sans GB, Microsoft YaHei, Arial;
      
    @media (min-width: 767px) {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgb(210, 210, 210);

      @media (prefers-color-scheme: dark) {
        background-color: rgb(30, 30, 30);
      }
    }
  }

  code {
    font-family: Inconsolata, Monaco, Consolas, "Courier New", Courier, monospace;
  }

  article {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
`;

const PlatformSection = styled.section`
  @media (min-width: 767px) {
    display: flex;
    justify-content: center;
  }
`;

const MainContent = styled.main`
  background-color: var(--bg-color);
  min-height: 80vh;

  @media (min-width: 767px) {
    width: 100%;
    padding-bottom: 30px;
  }
`;

const Layout = (props: {
  /**网站配置 */
  siteConfig: ISiteConfig;
  /**全部文章 */
  allPosts: ISiteConfig[];
  /** 当前页面 */
  currentPage: ICurrentPage;
  locale?: string;
  children: JSX.Element | JSX.Element[];
  menuItems: any[];
}) => {
  const { currentPage, siteConfig, locale, children, menuItems = [] } = props;

  const [colorScheme, setColorScheme] = useState("light");
  const containerEle = useRef(null);

  useEffect(() => {
    // Check if there's a saved preference in localStorage
    const localStoragePreference = localStorage.getItem(
      "COLOR_SCHEME_PREFERENCE"
    );

    // if (localStoragePreference) {
    if (false) {
      setColorScheme(localStoragePreference);
    } else {
      // Query the media preference if no preference is saved in localStorage
      const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      setColorScheme(darkMediaQuery.matches ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const container = document.querySelector(".content");

    if (container) {
      container.scrollTop = 0;
    }
  }, [currentPage]);

  return (
    <>
      <GlobalStyle />
      <ColorSchemeProvider value={{ colorScheme, setColorScheme }}>
        <PlatformSection id="platform">
          <Container dark={colorScheme === "dark"} deviceFrame={KindleOasis}>
            <div ref={containerEle}>
              <Header
                menuItems={menuItems}
                lang={locale}
                currentPage={currentPage}
                siteConfig={siteConfig}
                containerEle={containerEle}
              />
              <MainContent>
                <div>{children}</div>
                <br></br>
                {/* <RelatedLink
									links={siteConfig.relatedLinks}
									locale={locale}
								/> */}
              </MainContent>
            </div>
          </Container>
        </PlatformSection>
      </ColorSchemeProvider>
    </>
  );
};

export default Layout;
