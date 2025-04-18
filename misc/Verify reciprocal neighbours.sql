/* verify Reciprocal  neighbours */
select * from (
	select  
		pc.Country
		--, c.OmschrijvingNL
		, nb.Path_ID
		, nb.Neighbour
		-- List of all neighbours of the Path_ID
		, (	select STRING_AGG(Neighbour, ', ') 
				from dbo.svg_ctry_zip_EU_NB 
				where Path_ID = nb.Path_ID
			) AS PathID_Neighbours
		-- List of all neighbours of the Neighbour
		, (	select STRING_AGG(Neighbour, ', ') 
				from dbo.svg_ctry_zip_EU_NB 
				where Path_ID = nb.Neighbour
			) AS Neighbour_Neighbours

	from dbo.svg_ctry_zip_EU_NB nb (nolock)
	left join dbo.svg_ctry_zip_EU pc (nolock) on pc.Path_ID = nb.Path_ID
	--left join [Mitoz].dba.Land c (nolock) on c.IDLand = pc.Country
)d
where isnull(d.Neighbour_Neighbours, '') not like '%' + Path_ID + '%'
order by d.Path_ID

/* Verify if all paths were looped for labels */
select 
	* 
from dbo.svg_ctry_zip_EU pc
left join dbo.svg_ctry_zip_EU_NB nb on nb.Path_ID = pc.Path_ID
where nb.Path_ID is null