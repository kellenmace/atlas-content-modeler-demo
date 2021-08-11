import { gql } from "@apollo/client";
import parse from "html-react-parser";
import Link from "next/link";

import { client } from "../../lib/apolloClient";
import Layout from "../../components/Layout";

const GET_PROJECT = gql`
  query getProject($databaseId: ID!) {
    project(id: $databaseId, idType: DATABASE_ID) {
      streetAddress
      contactName
      workOrderNumber
      descriptionOfWork
      cost
      dateOfService
      propertyPhoto {
        mediaItemUrl
        altText
      }
    }
  }
`;

function formatCurrency(number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(number);
}

const formatDate = (date) => new Date(date).toLocaleDateString();

export default function Project({ project }) {
  const {
    streetAddress,
    contactName,
    workOrderNumber,
    descriptionOfWork,
    cost,
    dateOfService,
    propertyPhoto,
  } = project;

  return (
    <Layout>
      <Link href="/projects">
        <a>&#8592; Back to projects</a>
      </Link>
      <article className="single-project">
        <h1>{streetAddress}</h1>
        {propertyPhoto ? (
          <img
            src={propertyPhoto.mediaItemUrl}
            alt={propertyPhoto.altText}
            className="property-photo"
          />
        ) : null}
        <ul className="project-details">
          <li>
            <span className="label">👤 Contact</span>
            <span className="value">{contactName}</span>
          </li>
          <li>
            <span className="label">📁 Work Order #</span>
            <span className="value">{workOrderNumber}</span>
          </li>
          <li>
            <span className="label">💰 Cost</span>
            <span className="value">{formatCurrency(cost)}</span>
          </li>
          <li>
            <span className="label">📅 Date of Service</span>
            <span className="value">{formatDate(dateOfService)}</span>
          </li>
        </ul>
        <div className="project-description">{parse(descriptionOfWork)}</div>
      </article>
    </Layout>
  );
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const response = await client.query({
    query: GET_PROJECT,
    variables: {
      databaseId: context.params.id,
    },
  });

  const project = response?.data?.project;

  if (!project) {
    return { notFound: true };
  }

  return {
    props: { project },
    revalidate: 60,
  };
}
