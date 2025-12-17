"use client";

import * as React from "react";
import { Card, CardTitle, Typography, CardContent } from "@kindle-ui/core";
import { useTranslations } from "next-intl";
import type { ISiteConfig } from "@/types/index";
import styled from "styled-components";

const LinkList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 0.5em;
  column-gap: 0.75em;

  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
  }

  & a {
    color: inherit;
  }
`;

const LinkItem = ({ title, url }) => (
  <a key={title} href={url}>
    {title}
  </a>
);

const RelatedLink = ({
  links = [],
}: {
  links: ISiteConfig["relatedLinks"];
}) => {
  const t = useTranslations("RelatedLinks");

  return (
    <div className="P(10px)">
      <Card>
        <CardTitle>{t("title")}</CardTitle>
        <CardContent>
          <Typography>
            <LinkList>
              {[
                ...links,
                {
                  title: t("submit"),
                  url: "https://github.com/RiverTwilight/rene.wang/issues/22",
                },
              ].map((item, i) => (
                <LinkItem {...item} key={i} />
              ))}
            </LinkList>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatedLink;
