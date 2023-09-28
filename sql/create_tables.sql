CREATE TABLE IF NOT EXISTS public.sprints
(
    id serial NOT NULL,
    team_id integer NOT NULL,
    effort_completed integer NOT NULL,
    milestone_total_effort integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    sprint_end_date date NOT NULL,
    CONSTRAINT sprints_pkey PRIMARY KEY (id)
);