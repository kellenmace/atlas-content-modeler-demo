import { gql } from "@apollo/client";
import Link from "next/link";

import { client } from "../lib/apolloClient";
import Layout from "../components/Layout";

const GET_PROJECTS = gql`
  query getProjects {
    projects(first: 10, after: null) {
      nodes {
        databaseId
        streetAddress
        propertyPhoto {
          mediaItemUrl
          altText
        }
      }
    }
  }
`;

export default function Projects(props) {
  const { projects } = props;

  return (
    <Layout>
      <h1>Projects</h1>
      <ul className="projects-list">
        {projects.map((project) => (
          <li key={project.databaseId}>
            <article className="project-card">
              {project.propertyPhoto ? (
                <Link href={`/project/${project.databaseId}`}>
                  <a>
                    <img
                      src={project.propertyPhoto.mediaItemUrl}
                      alt={project.propertyPhoto.altText}
                      className="property-photo"
                    />
                  </a>
                </Link>
              ) : null}
              <h2>
                <Link href={`/project/${project.databaseId}`}>
                  <a>{project.streetAddress}</a>
                </Link>
              </h2>
            </article>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export async function getStaticProps() {
  const response = await client.query({
    query: GET_PROJECTS,
  });

  return {
    props: {
      projects: response.data.projects.nodes,
    },
  };
}
